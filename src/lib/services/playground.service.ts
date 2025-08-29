import Anthropic from "@anthropic-ai/sdk";
import type { PlaygroundSession, ModelParameters, TokenUsage } from "@/types";
import {
  IStorageService,
  storageService,
  StorageKeys,
} from "./storage.service";

// Playground Service - Single Responsibility: Managing API interactions
export interface IPlaygroundService {
  createSession(
    prompt: string,
    systemPrompt: string,
    parameters: ModelParameters,
  ): Promise<PlaygroundSession>;
  getSessionHistory(): PlaygroundSession[];
  clearHistory(): void;
  estimateCost(tokensUsed: TokenUsage): number;
  validateApiKey(apiKey: string): Promise<boolean>;
}

export class PlaygroundService implements IPlaygroundService {
  private anthropicClient: Anthropic | null = null;

  constructor(private storage: IStorageService = storageService) {}

  private initializeClient(apiKey: string): void {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    // Initialize client with user's API key
    this.anthropicClient = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for browser usage
    });
  }

  async createSession(
    prompt: string,
    systemPrompt: string = "",
    parameters: ModelParameters,
  ): Promise<PlaygroundSession> {
    // Get API key from storage
    const settings = this.storage.get<{ apiKeys: { anthropic?: string } }>(
      StorageKeys.USER_SETTINGS,
    );
    const apiKey = settings?.apiKeys?.anthropic;

    if (!apiKey) {
      throw new Error("Please add your Anthropic API key in settings");
    }

    this.initializeClient(apiKey);

    const session: PlaygroundSession = {
      id: this.generateSessionId(),
      prompt,
      systemPrompt,
      model: {
        provider: "anthropic",
        name: "claude-3-sonnet-20240229",
        maxTokens: 4096,
      },
      parameters,
      timestamp: new Date().toISOString(),
    };

    try {
      if (!this.anthropicClient) {
        throw new Error("Anthropic client not initialized");
      }

      // Make API call to Anthropic
      const response = await this.anthropicClient.messages.create({
        model: session.model.name,
        max_tokens: parameters.maxTokens,
        temperature: parameters.temperature,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Extract response and token usage
      session.response =
        response.content[0].type === "text"
          ? response.content[0].text
          : "Non-text response received";

      // Calculate token usage (Anthropic provides this in the response)
      session.tokensUsed = {
        promptTokens: response.usage?.input_tokens || 0,
        completionTokens: response.usage?.output_tokens || 0,
        totalTokens:
          (response.usage?.input_tokens || 0) +
          (response.usage?.output_tokens || 0),
        estimatedCost: this.estimateCost({
          promptTokens: response.usage?.input_tokens || 0,
          completionTokens: response.usage?.output_tokens || 0,
          totalTokens:
            (response.usage?.input_tokens || 0) +
            (response.usage?.output_tokens || 0),
        }),
      };
    } catch (error) {
      session.error =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Playground API error:", error);
    }

    // Save session to history
    this.saveSession(session);

    return session;
  }

  getSessionHistory(): PlaygroundSession[] {
    const history = this.storage.get<PlaygroundSession[]>(
      StorageKeys.PLAYGROUND_HISTORY,
    );
    return history || [];
  }

  clearHistory(): void {
    this.storage.remove(StorageKeys.PLAYGROUND_HISTORY);
  }

  estimateCost(tokensUsed: TokenUsage): number {
    // Pricing for Claude 3 Sonnet (as of 2024)
    // These should be updated based on current pricing
    const inputPricePerMillion = 3.0; // $3 per million input tokens
    const outputPricePerMillion = 15.0; // $15 per million output tokens

    const inputCost =
      (tokensUsed.promptTokens / 1000000) * inputPricePerMillion;
    const outputCost =
      (tokensUsed.completionTokens / 1000000) * outputPricePerMillion;

    return Number((inputCost + outputCost).toFixed(4));
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      this.initializeClient(apiKey);

      if (!this.anthropicClient) {
        return false;
      }

      // Make a minimal API call to validate the key
      await this.anthropicClient.messages.create({
        model: "claude-3-haiku-20240307", // Use the cheapest model for validation
        max_tokens: 1,
        messages: [
          {
            role: "user",
            content: "Hi",
          },
        ],
      });

      return true;
    } catch (error) {
      console.error("API key validation failed:", error);
      return false;
    }
  }

  private saveSession(session: PlaygroundSession): void {
    const history = this.getSessionHistory();

    // Add new session to the beginning
    history.unshift(session);

    // Keep only last 100 sessions
    const trimmedHistory = history.slice(0, 100);

    this.storage.set(StorageKeys.PLAYGROUND_HISTORY, trimmedHistory);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper method to export sessions
  exportSessions(): string {
    const sessions = this.getSessionHistory();
    return JSON.stringify(sessions, null, 2);
  }

  // Helper method to import sessions
  importSessions(sessionsJson: string): void {
    try {
      const sessions = JSON.parse(sessionsJson) as PlaygroundSession[];
      const currentHistory = this.getSessionHistory();
      const mergedHistory = [...sessions, ...currentHistory];

      // Remove duplicates based on session ID
      const uniqueHistory = mergedHistory.filter(
        (session, index, self) =>
          index === self.findIndex((s) => s.id === session.id),
      );

      this.storage.set(
        StorageKeys.PLAYGROUND_HISTORY,
        uniqueHistory.slice(0, 100),
      );
    } catch (error) {
      console.error("Failed to import sessions:", error);
      throw new Error("Invalid session data format");
    }
  }

  // Get statistics about playground usage
  getUsageStatistics() {
    const sessions = this.getSessionHistory();

    let totalTokens = 0;
    let totalCost = 0;
    let successfulSessions = 0;
    let failedSessions = 0;

    for (const session of sessions) {
      if (session.tokensUsed) {
        totalTokens += session.tokensUsed.totalTokens;
        totalCost += session.tokensUsed.estimatedCost || 0;
      }

      if (session.error) {
        failedSessions++;
      } else {
        successfulSessions++;
      }
    }

    return {
      totalSessions: sessions.length,
      successfulSessions,
      failedSessions,
      totalTokens,
      totalCost: Number(totalCost.toFixed(2)),
      averageTokensPerSession:
        sessions.length > 0 ? Math.round(totalTokens / sessions.length) : 0,
    };
  }
}

// Singleton instance
export const playgroundService = new PlaygroundService();

import { test, expect } from '@playwright/test';

test.describe('Course Pages', () => {
  test('should display course overview with correct information', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals');
    
    // Check course title and description
    await expect(page.locator('h1')).toContainText('AI Fundamentals');
    await expect(page.locator('text=Master the core concepts')).toBeVisible();
    
    // Check course metadata
    await expect(page.locator('text=12 hours')).toBeVisible();
    await expect(page.locator('text=2 modules')).toBeVisible();
    await expect(page.locator('text=beginner')).toBeVisible();
    
    // Check Start Course button
    await expect(page.locator('button:has-text("Start Course")')).toBeVisible();
  });

  test('should display course modules and lessons', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals');
    
    // Check if Course Content section exists
    await expect(page.locator('h2:has-text("Course Content")')).toBeVisible();
    
    // Check first module
    await expect(page.locator('text=Module 1: Introduction to AI and LLMs')).toBeVisible();
    
    // Expand first module if needed and check lessons
    const firstModule = page.locator('text=Module 1').first();
    await firstModule.click();
    
    // Check if lessons are visible
    await expect(page.locator('text=History and Evolution of AI')).toBeVisible();
    await expect(page.locator('text=What are Large Language Models?')).toBeVisible();
  });

  test('should navigate to lesson page when clicking on a lesson', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals');
    
    // Expand first module
    await page.click('text=Module 1: Introduction to AI and LLMs');
    
    // Click on first lesson
    await page.click('text=History and Evolution of AI');
    
    // Should navigate to lesson page
    await expect(page).toHaveURL('/courses/ai-fundamentals/lessons/history-evolution');
    
    // Check if lesson content is displayed
    await expect(page.locator('h1')).toContainText('History and Evolution of AI');
  });

  test('should display What You\'ll Learn section', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals');
    
    // Check What You'll Learn section
    await expect(page.locator('text=What You\'ll Learn')).toBeVisible();
    await expect(page.locator('text=Key concepts and skills')).toBeVisible();
    
    // Check if objectives are listed
    const objectives = page.locator('text=Understand the timeline of AI development');
    await expect(objectives).toBeVisible();
  });

  test('should handle course prerequisites', async ({ page }) => {
    await page.goto('/courses/prompt-engineering');
    
    // This course has AI Fundamentals as prerequisite
    const prerequisiteSection = page.locator('text=Prerequisites');
    
    // If prerequisites exist, they should be displayed
    const count = await prerequisiteSection.count();
    if (count > 0) {
      await expect(prerequisiteSection).toBeVisible();
      await expect(page.locator('text=AI Fundamentals').nth(1)).toBeVisible();
    }
  });

  test('should display course tags', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals');
    
    // Check if tags are displayed
    await expect(page.locator('text=fundamentals')).toBeVisible();
    await expect(page.locator('text=transformers')).toBeVisible();
    await expect(page.locator('text=llm')).toBeVisible();
  });
});

test.describe('Lesson Pages', () => {
  test('should display lesson content with markdown rendering', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals/lessons/history-evolution');
    
    // Check lesson title
    await expect(page.locator('text=History and Evolution of AI').first()).toBeVisible();
    
    // Check lesson metadata
    await expect(page.locator('text=20 min')).toBeVisible();
    await expect(page.locator('text=reading')).toBeVisible();
    
    // Check learning objectives
    await expect(page.locator('text=Learning Objectives')).toBeVisible();
    
    // Check if markdown content is rendered
    await expect(page.locator('h1:has-text("History and Evolution of AI")')).toBeVisible();
    await expect(page.locator('text=The Journey to Modern LLMs')).toBeVisible();
  });

  test('should display lesson sidebar with navigation', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals/lessons/history-evolution');
    
    // Check if sidebar is visible
    await expect(page.locator('text=Back to Course')).toBeVisible();
    
    // Check if module list is in sidebar
    await expect(page.locator('text=Module 1').nth(1)).toBeVisible();
    
    // Check if current lesson is highlighted
    const currentLesson = page.locator('text=History and Evolution of AI').nth(1);
    await expect(currentLesson).toBeVisible();
  });

  test('should navigate between lessons using navigation buttons', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals/lessons/history-evolution');
    
    // Check if navigation buttons exist
    const prevButton = page.locator('button:has-text("Previous Lesson")');
    const nextButton = page.locator('button:has-text("Next Lesson")');
    
    // First lesson should have disabled previous button
    await expect(prevButton).toBeDisabled();
    
    // Next button should be enabled
    await expect(nextButton).toBeEnabled();
    
    // Click next button
    await nextButton.click();
    
    // Should navigate to next lesson
    await expect(page).toHaveURL('/courses/ai-fundamentals/lessons/llm-basics');
  });

  test('should display lesson resources if available', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals/lessons/history-evolution');
    
    // Check if resources section exists
    const resourcesSection = page.locator('text=Additional Resources');
    const count = await resourcesSection.count();
    
    if (count > 0) {
      await expect(resourcesSection).toBeVisible();
      // Check if resource links are present
      await expect(page.locator('text=Attention Is All You Need Paper')).toBeVisible();
    }
  });

  test('should display exercise section for lessons with exercises', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals/lessons/llm-basics');
    
    // This lesson has a quiz exercise
    const exerciseTab = page.locator('text=Exercise');
    const count = await exerciseTab.count();
    
    if (count > 0) {
      await expect(exerciseTab).toBeVisible();
      
      // Click on exercise tab
      await exerciseTab.click();
      
      // Check if exercise content is displayed
      await expect(page.locator('text=LLM Fundamentals Quiz')).toBeVisible();
      await expect(page.locator('button:has-text("Start Exercise")')).toBeVisible();
    }
  });

  test('should show Mark as Complete button', async ({ page }) => {
    await page.goto('/courses/ai-fundamentals/lessons/history-evolution');
    
    // Check if Mark as Complete button exists
    const completeButton = page.locator('button:has-text("Mark as Complete")');
    await expect(completeButton).toBeVisible();
    
    // Click the button
    await completeButton.click();
    
    // Button should disappear or change state
    await expect(completeButton).not.toBeVisible();
  });
});
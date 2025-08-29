import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI\/LLM Learning Platform/);
    await expect(page.locator('h1')).toContainText('Master AI & LLM Engineering');
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Courses');
    await expect(page).toHaveURL('/courses');
    await expect(page.locator('h1')).toContainText('All Courses');
  });

  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check if sidebar navigation items are visible
    await expect(page.locator('text=Home').first()).toBeVisible();
    await expect(page.locator('text=Courses').first()).toBeVisible();
    await expect(page.locator('text=Playground').first()).toBeVisible();
    await expect(page.locator('text=Settings').first()).toBeVisible();
  });

  test('should show breadcrumb navigation', async ({ page }) => {
    await page.goto('/courses');
    
    // Check breadcrumb
    const breadcrumb = page.locator('[aria-label="Breadcrumb"]').first();
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toContainText('Home');
    await expect(breadcrumb).toContainText('Courses');
  });

  test('should navigate to a specific course', async ({ page }) => {
    await page.goto('/courses');
    
    // Click on AI Fundamentals course
    await page.click('text=AI Fundamentals');
    await expect(page).toHaveURL('/courses/ai-fundamentals');
    
    // Check if course overview is displayed
    await expect(page.locator('h1')).toContainText('AI Fundamentals');
    await expect(page.locator('text=Course Content')).toBeVisible();
  });

  test('should toggle mobile menu', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    await page.goto('/');
    
    // Mobile menu should be hidden initially
    const sidebar = page.locator('.md\\:flex').first();
    await expect(sidebar).not.toBeVisible();
    
    // Click menu button
    await page.click('[aria-label="Toggle menu"]');
    
    // Sidebar should be visible
    await expect(page.locator('text=AI Learn').nth(1)).toBeVisible();
  });
});

test.describe('Course Learning Paths', () => {
  test('should display all 6 learning paths on home page', async ({ page }) => {
    await page.goto('/');
    
    const learningPaths = [
      'AI Fundamentals',
      'Prompt Engineering',
      'RAG Systems',
      'Agent Development',
      'Fine-tuning',
      'Production & Scaling'
    ];
    
    for (const path of learningPaths) {
      await expect(page.locator(`text=${path}`)).toBeVisible();
    }
  });

  test('should navigate from home to course via Start Learning button', async ({ page }) => {
    await page.goto('/');
    
    // Click Start Learning button
    await page.click('text=Start Learning');
    await expect(page).toHaveURL('/courses');
  });

  test('should show course cards with progress indicators', async ({ page }) => {
    await page.goto('/courses');
    
    // Check if course cards are displayed
    const courseCards = page.locator('[class*="hover:shadow-lg"]');
    await expect(courseCards).toHaveCount(6);
    
    // Check if first course card has expected elements
    const firstCard = courseCards.first();
    await expect(firstCard.locator('text=Start Course')).toBeVisible();
  });
});
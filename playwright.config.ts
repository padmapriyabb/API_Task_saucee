
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: 'html',

  use: {
    baseURL: 'https://simple-books-api.click',
    extraHTTPHeaders: {
      'Accept': 'application/json'
    }
  }
});

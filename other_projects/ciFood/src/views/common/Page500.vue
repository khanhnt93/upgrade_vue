<template>
  <div class="app flex items-center justify-center min-h-screen bg-gray-100">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-2/3 lg:w-1/2">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-start mb-6">
              <h1 class="text-6xl font-bold text-red-600 mr-6">500</h1>
              <div>
                <h4 class="text-2xl font-semibold mb-2">Houston, we have a problem!</h4>
                <p class="text-gray-600">The page you are looking for is temporarily unavailable.</p>
              </div>
            </div>
            
            <div class="flex gap-2">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-l-md">
                  <font-awesome-icon icon="search" class="text-gray-500" />
                </div>
              </div>
              <input
                type="text"
                class="flex-1 px-3 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="What are you looking for?"
              />
              <button class="bg-info-500 hover:bg-info-600 text-white px-6 py-2 rounded-r-md">
                Search
              </button>
            </div>

            <div class="mt-6 text-center">
              <router-link to="/" class="text-primary-500 hover:text-primary-600">
                <font-awesome-icon icon="home" class="mr-2" />
                Go Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Simple error page - no additional logic needed
</script>

<style scoped>
/* Additional styles if needed */
</style>

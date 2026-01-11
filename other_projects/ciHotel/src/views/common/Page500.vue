<template>
  <div class="app flex flex-row items-center">
    <div class="container-fluid">
      <div class="flex justify-center">
        <div class="md:w-1/2">
          <div class="clearfix">
            <h1 class="float-left text-7xl mr-4">
              500
            </h1>
            <h4 class="pt-3 text-xl font-semibold">
              Houston, we have a problem!
            </h4>
            <p class="text-gray-500">
              The page you are looking for is temporarily unavailable.
            </p>
          </div>
          <div class="flex mt-4">
            <div class="flex items-center bg-gray-200 px-3 rounded-l">
              <i class="fa fa-search" />
            </div>
            <input
              id="prependedInput"
              class="flex-1 px-3 py-2 border border-gray-300"
              type="text"
              autocomplete="new-password"
              placeholder="What are you looking for?"
            />
            <button class="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page500'
}
</script>

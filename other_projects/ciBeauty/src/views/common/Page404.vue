<template>
  <div class="app flex-row align-items-center min-h-screen">
    <div class="container-fluid">
      <div class="grid grid-cols-1 justify-center">
        <div class="w-full md:w-1/2 mx-auto">
          <div class="clearfix">
            <h1 class="float-left text-6xl font-bold mr-4 text-gray-800">
              404
            </h1>
            <h4 class="pt-3 text-xl font-semibold text-gray-700">
              Oops! You're lost.
            </h4>
            <p class="text-gray-500 mt-2">
              The page you are looking for was not found.
            </p>
          </div>
          <div class="flex mt-6">
            <div class="flex-1 flex items-center">
              <div class="flex-shrink-0 flex items-center justify-center bg-gray-100 px-3 py-2 rounded-l-md">
                <i class="fa fa-search text-gray-600" />
              </div>
              <input
                id="prependedInput"
                class="form-control rounded-none flex-1"
                type="text"
                autocomplete="new-password"
                placeholder="What are you looking for?"
              >
              <button class="btn btn-info rounded-l-none">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>

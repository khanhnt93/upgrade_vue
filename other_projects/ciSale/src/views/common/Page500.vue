<template>
  <div class="app flex-row align-items-center">
    <div class="container-fluid">
      <div class="flex flex-wrap justify-content-center">
        <div class="w-full md:w-1/2 px-2">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">
              500
            </h1>
            <h4 class="pt-3">
              Houston, we have a problem!
            </h4>
            <p class="text-muted">
              The page you are looking for is temporarily unavailable.
            </p>
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-search" />
              </span>
            </div>
            <input
              id="prependedInput"
              class="form-control"
              size="16"
              type="text"
              autocomplete="new-password"
              placeholder="What are you looking for?"
            >
            <div class="input-group-append">
              <button class="btn btn-info">
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
  name: 'Page500'
}
</script>

import React from "react";

function Loading() {
  return (
    <div className="text-center col-subscribe pb-5">
      <div class="mt-5 spinner-border text-danger" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;

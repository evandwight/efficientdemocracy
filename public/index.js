function vote(event) {
  event.preventDefault();
  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  var element = event.currentTarget;
  var targetImg = element.children[0];
  var other = document.getElementById(element.getAttribute("data-other"));
  var otherImg = other.children[0];
  var url = element.href;
  var sources = {
    active: '/public/icons/caret-up-active.svg',
    inactive: '/public/icons/caret-up-inactive.svg',
    error: '/public/icons/caret-up-error.svg',
  }


  axios.post(url, "_csrf=" + token).then(function (result) {
    if (targetImg.src.endsWith(sources.active)) {
      targetImg.src = sources.inactive;
    } else {
      targetImg.src = sources.active;
      otherImg.src = sources.inactive;
    }
  }).catch(function (error) {
    if (error.response.status === 401) {
      window.location.assign("/users/login");
    } else if (error.response && error.response.status === 403) {
      window.location.assign("/user/strikes");
    } else {
      targetImg.src = sources.error;
    }
  });
}

function post(event) {
  event.preventDefault();
  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  var element = this.event.currentTarget;
  var url = element.href;


  axios.post(url, "_csrf=" + token).catch(function (error) {
    if (error.response && error.response.status === 401) {
      window.location.assign("/users/login");
    } else if (error.response && error.response.status === 403) {
      window.location.assign("/user/strikes");
    } else {
      element.classList.add("error");
      setTimeout(function() {element.classList.remove("error")}, 5000);
    }
  });
}

// Attach listeners
document.addEventListener('DOMContentLoaded', function () {
  Array.from(document.getElementsByClassName('onclick-vote')).forEach(element => {
    element.addEventListener('click', vote);
  });
  Array.from(document.getElementsByClassName('onclick-post')).forEach(element => {
    element.addEventListener('click', post);
  });
});
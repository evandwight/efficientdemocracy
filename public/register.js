function submitRegister(event) {
    event.preventDefault();
    var element = event.currentTarget;
    var siteKey = element.getAttribute("data-site-key");
    var action = element.getAttribute("data-action");
    
    if (!grecaptcha) {
        return;
    }

    grecaptcha.ready(function() {
        grecaptcha.execute(siteKey, {action}).then(function(token) {
            // Add your logic to submit to your backend server here.
            document.getElementById("register-form-token").value = token;
            document.getElementById("register-form").submit();
        });
      });
}

// Attach listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("register-form").addEventListener('submit', submitRegister);
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var sendAjax = function sendAjax(action, data) {
  $.ajax({
    cache: false,
    type: "POST",
    url: action,
    data: data,
    dataType: "json",
    success: function success(result, status, xhr) {
      $("#domoMessage").animate({ width: 'hide' }, 350);

      window.location = result.redirect;
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });
};

$(document).ready(function () {
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
      handleError("RAWR! Passwords do not match");
      return false;
    }

    sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

    return false;
  });

  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
      handleError("RAWR! Username or password is empty");
      return false;
    }

    sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

    return false;
  });

  $("#domoForm").on("submit", function (e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoFood").val() == '') {
      handleError("RAWR! All fields are required");
      return false;
    }

    sendAjax($("#domoForm").attr("action"), $("#domoForm").serialize());

    return false;
  });
});

// maybe with react??
var changePassword = function changePassword(e) {
  e.preventDefault();

  if ($("#oldpass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
      handleError("all fields required");
      return false;
  }
  if ($("#pass").val() != $("#pass2").val()) {
      handleError("passwords arn't the same");
      return false;
  }
  sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), redirect);

  return false;
};

var PassWindow = function PassWindow(props) {
  return React.createElement(
      'form',
      { id: 'passForm', name: 'passForm',
          onSubmit: changePassword,
          action: '/changePass',
          method: 'POST',
          className: 'mainForm' },
      React.createElement(
          'div',
          { id: 'passChangeFormInput' },
          React.createElement(
              'div',
              { id: 'oldPassElement' },
              React.createElement(
                  null,
                  'Current Password:'
              ),
              React.createElement('input', { id: 'oldpass', type: 'password', name: 'oldpass', placeholder: 'old password' })
          ),
          React.createElement(
              'div',
              { id: 'PassElement' },
              React.createElement(
                  null,
                  'New Password:'
              ),
              React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' })
          ),
          React.createElement(
              'div',
              { id: 'newPassElement' },
              React.createElement(
                  null,
                  'Confirm New Password:'
              ),
              React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' })
          )
      ),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
      React.createElement('input', { id: 'Button4Pass', className: 'formSubmit', type: 'submit', value: 'Change Password' })
  );
};



var setup = function setup(csrf) {
  document.querySelector("#passChange").addEventListener("click", function (e) {
      e.preventDefault();
      ReactDOM.render(React.createElement(PassWindow, { csrf: csrf }), document.querySelector("#content"));
      return false;
  });

  ReactDOM.render(React.createElement(DomoList, { csrf: csrf }), document.querySelector('#makeDomo'));

  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector('#domos'));

  loadItemsFromServer(csrf);
};

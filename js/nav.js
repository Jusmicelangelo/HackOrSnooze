"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show newStory form on click on "submit" */

function newStoryClick(evt) {
  console.debug("newStoryClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navstorySubmit.on("click", newStoryClick);

/** Show favorites on click on "favourites" */

function favouriteClick(evt) {
  console.debug("favouriteClick", evt);
  hidePageComponents();
  favoritesListOnPage();
}

$body.on("click", "#nav-favorites", favouriteClick);

// Show My Stories on clicking "my stories" //

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  userStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);


/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

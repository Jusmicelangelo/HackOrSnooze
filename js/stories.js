"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn=false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // fav star only visible if user is signed in
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? deleteBtn() : ""}
        ${showStar ? createStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        <hr style="opacity: 0.2"> 
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Post a new story */
async function postNewStory (event) {
  console.debug("postNewStory");
  event.preventDefault();

  // collect input 
  const newStoryAuthor = $("#newStoryAuthor").val()
  const newStoryTitle = $("#newStoryTitle").val()
  const newStoryURL = $("#newStoryUrl").val()
  const userName = currentUser.username
  
  // get API newStory
  const newStory = await storyList.addStory(currentUser, {
    author: newStoryAuthor, 
    title: newStoryTitle, 
    url: newStoryURL, 
    username: userName
  })
  // render newStory and prepend it to the list
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);

  // hide the form and reset it
  $newStoryForm.slideUp("slow");
  $newStoryForm.trigger("reset");
}

$newStoryForm.on("submit", postNewStory);

//delete a story //
async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // actualized story list
  userStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

// Implement symbol for favorite/not-favorite status //

function createStar(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

// Delete button story //

function deleteBtn() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

// showing Favorites

function favoritesListOnPage() {
  console.debug("favoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h4>No favourites yet</h4>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($target.hasClass("fas")) {
    // currently a favorite => remove as an favourite 
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite => becoming a favourite
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);


// user's own stories //
function userStoriesOnPage() {
  console.debug("userStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h4>Write your first own story!</h4>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}
const APIURL = "https://api.github.com/users/";
const Form = document.getElementById("form");
const Main = document.getElementById("main");
const InputSearch = document.getElementById("search");

//fetch github user data
async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepo(username);
  } catch (err) {
    if (err.response && err.response.status == 404) {
      createErrorCard("No profile with this username");
    } else {
      createErrorCard("Error fetching user data");
    }
  }
}

//get user function
Form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = InputSearch.value.trim();
  if (user) {
    getUser(user);
    InputSearch.value = "";
  }
});

//create user card
function createUserCard(user) {
  const userId = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHtml = `
        <div class="card">
            <div>
                <img src = "${user.avatar_url}"  alt= "${user.name}" class="avatar"/>
            </div>
            <div class="user-info">
                <h2>${userId}</h2>
                ${userBio}
                <ul>
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>
                <div id ="repos"></div>
            </div>
        </div>
    `;
  Main.innerHTML = cardHtml;
}

//fetch user repos
async function getRepo(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposTocard(data);
  } catch (e) {
    createErrorCard("Problem fetching repos");
  }
}

//add repos to card
function addReposTocard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoLink = document.createElement("a");
    repoLink.classList.add("repo");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.innerText = repo.name;
    reposEl.appendChild(repoLink);
  });
}

//error card
function createErrorCard(message) {
  const cardHtml = `
    <div class="card">
        <h1>${message}</h1>
    </div>`;
  Main.innerHTML = cardHtml;
}

const config = {
  token: "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",
  url: "https://api.github.com/graphql",
};
const form = document.getElementById("form");
const main = document.getElementById("container");

function relocate() {
  var username = document.getElementById("username").value;

  if (username == "") {
    document.getElementById("error").innerHTML = "*Enter your github username";
  } else {
    form.style.display = "none";
    main.style.display = "flex";
    console.log(username);
  }
  // query($username: String="japhmayor"){
  const queryInfo = {
    query: `query($username: String="japhmayor"){
            user(login: $username){
            name
            bio
            avatarUrl
            repositories(first: 20){
            nodes{
            name
            url
            forkCount
            stargazerCount
            updatedAt
            languages(first: 1) {
              nodes{
                name
                color
              }
            }
            }
            }
            }
            }
            `,
    variables: {
      username: username,
    },
  };
  // const params = { username: "unicodeveloper" };
  const url = config.url;
  const token = config.token;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
    body: JSON.stringify(queryInfo),
  };

  var githubData;
  // (async () => {
  //   const response = await fetch(url, options);
  //   const json = await response.json();
  //   githubData = json;
  //   console.log(json);
  // })();
  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response error");
      }
    })
    .then((response) => (githubData = response.data))
    .then((data) => {
      console.log(data);
      displayInfo(data.user.repositories.nodes);
      displayBio(data.user.bio);
      displayName(data.user.name);
      getLength(data.user.repositories.nodes.length);
      displayImage(data.user.avatarUrl);
    });

  function displayInfo(data) {
    var mainContainer = document.getElementById("left");
    for (var i = 0; i < data.length; i++) {
      var repos = document.createElement("div");
      repos.className = "repo";
      const titleButtonCon = document.createElement("section");
      titleButtonCon.className = "title-box";
      repos.appendChild(titleButtonCon);
      var repoHeader = document.createElement("p");
      repoHeader.className = "repo-title";
      repoHeader.innerHTML = data[i].name;
      mainContainer.appendChild(repos);
      titleButtonCon.appendChild(repoHeader);
      // star button
      const starButton = document.createElement("button");
      starButton.innerHTML = "star";
      titleButtonCon.appendChild(starButton);
      // const starInButton = document.createElement("i");
      // starButton.appendChild(starInButton);
      // starInButton.className = "far fa-star";
      //
      const actions = document.createElement("section");
      actions.className = "actions";
      // add actions div under repos
      repos.appendChild(actions);

      // color
      const con = document.createElement("section");
      con.className = "lang";
      for (var k = 0; k < data[i].languages.nodes.length; k++) {
        const color = document.createElement("span");
        color.className = "color";
        color.style.backgroundColor = data[i].languages.nodes[k].color;
        con.appendChild(color);
        actions.appendChild(con);
      }

      // language

      for (var j = 0; j < data[i].languages.nodes.length; j++) {
        var langs = document.createElement("p");
        // const color = document.createElement("span");
        langs.innerHTML = data[i].languages.nodes[j].name;
        con.appendChild(langs);

        // con.appendChild(color);
      }

      // stars
      const starCon = document.createElement("section");
      starCon.className = "star-container";
      actions.appendChild(starCon);
      const starEmoji = document.createElement("i");
      starEmoji.className = "far fa-star";
      starCon.appendChild(starEmoji);
      const stars = document.createElement("p");
      stars.innerHTML = data[i].stargazerCount;
      starCon.appendChild(stars);

      // forks
      const forkCon = document.createElement("section");
      forkCon.className = "fork-container";
      actions.appendChild(forkCon);
      const forkEmoji = document.createElement("i");
      forkEmoji.className = "fas fa-code-branch";
      forkCon.appendChild(forkEmoji);
      const fork = document.createElement("p");
      fork.innerHTML = data[i].forkCount;
      forkCon.appendChild(fork);

      // updated time
      const time = document.createElement("p");
      var d = new Date(data[i].updatedAt);
      var day = d.getDay();
      var month = d.toLocaleDateString("default", { month: "short" });
      time.innerHTML = `Updated on ${day} ${month}`;
      actions.appendChild(time);

      // hr line
      const line = document.createElement("hr");
      repos.appendChild(line);
    }
  }

  function displayBio(data) {
    var bio = document.getElementById("bio");
    bio.innerHTML = data;
  }

  function displayName(data) {
    var name = document.getElementById("namee");
    name.innerHTML = data;
  }

  function getLength(data) {
    var length = document.getElementById("number");
    length.innerHTML = data;
  }

  function displayImage(data) {
    // const profileImage = document.createElement("img");
    // profileImage.src = data;
    const image = document.getElementById("img");
    image.src = data;
    // imageDiv.appendChild(profileImage);
    // img.style.background = "url('" + data + "')";
  }
}

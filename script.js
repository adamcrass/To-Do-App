document.addEventListener("DOMContentLoaded", loadLists);

function buttonAlert() {
  const listBox = document.getElementById("new-list-box");
  const itemBox = document.getElementById("new-item-box");
  const listName = listBox.value.trim();
  const itemName = itemBox.value.trim();

  if (listName === "") {
    alert("Please enter a list name.");
    return;
  }

  if (itemName === "") {
    createNewList(listName);
  } else {
    addItemToList(listName, itemName);
    itemBox.value = ""; // Clear item input after adding
  }

  listBox.value = ""; // Clear list input after processing
  saveLists(); // Save data after each action
}

function addItemToList(listName, itemName) {
  const listGroup = document.getElementById("list-group");
  let existingList = Array.from(listGroup.getElementsByClassName("list")).find(
    (list) => list.querySelector(".list-header")?.textContent === listName
  );

  if (!existingList) {
    existingList = createNewList(listName);
  }

  const newItem = document.createElement("li");
  newItem.textContent = itemName;
  existingList.appendChild(newItem);

  saveLists(); // Save data after adding an item
}

function createNewList(listName) {
  const listGroup = document.getElementById("list-group");
  let existingList = Array.from(listGroup.getElementsByClassName("list")).find(
    (list) => list.querySelector(".list-header")?.textContent === listName
  );

  if (existingList) return existingList;

  const newList = document.createElement("ul");
  newList.classList.add("list");

  const listHeader = document.createElement("p");
  listHeader.classList.add("list-header");
  listHeader.textContent = listName;

  newList.appendChild(listHeader);
  listGroup.appendChild(newList);

  saveLists(); // Save data after creating a new list
  return newList;
}

function saveLists() {
  const listGroup = document.getElementById("list-group");
  let lists = [];

  listGroup.querySelectorAll(".list").forEach((list) => {
    const listName = list.querySelector(".list-header").textContent;
    const items = Array.from(list.querySelectorAll("li")).map(
      (item) => item.textContent
    );
    lists.push({ name: listName, items: items });
  });

  localStorage.setItem("todoLists", JSON.stringify(lists));
}

function loadLists() {
  const storedLists = localStorage.getItem("todoLists");
  if (!storedLists) return;

  const lists = JSON.parse(storedLists);
  const listGroup = document.getElementById("list-group");

  // **Clear all existing lists before reloading from storage**
  listGroup.innerHTML = "";

  lists.forEach((listData) => {
    const newList = createNewList(listData.name);

    // **Only add new items (avoid duplicating the original ones)**
    listData.items.forEach((item) => {
      const newItem = document.createElement("li");
      newItem.textContent = item;
      newList.appendChild(newItem);
    });
  });
}

document.getElementById("nlb-enter").addEventListener("click", buttonAlert);
document.getElementById("nib-enter").addEventListener("click", buttonAlert);

document
  .getElementById("new-item-box")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      buttonAlert();
    }
  });

document
  .getElementById("new-list-box")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      buttonAlert();
    }
  });

document.getElementById("reset-btn").addEventListener("click", function () {
  // Clear local storage
  localStorage.removeItem("todoLists");

  // Clear the displayed lists
  const listGroup = document.getElementById("list-group");
  listGroup.innerHTML = "";

  // Optionally, show a confirmation message
  alert("Lists have been reset!");
});

let form = document.forms.letter;
let checkbox = form.elements.checkbox;
let calendar = form.elements.letter__date;

function hideCalendar() {
  if (checkbox.checked == false) {
    calendar.hidden = true;
  }
  if (checkbox.checked == true) {
    calendar.hidden = false;
  }
}

hideCalendar();

checkbox.onchange = hideCalendar;

function deleteMessage(event) {
  let del = event.target;
  let message = del.closest(".message");
  message.remove();
}

function deleteChat(event) {
  let del = event.target;
  let chat = del.closest(".nav-chats__item");
  // chat.remove();
}

function editChat(event) {
  let edit = event.target;
  let chat = edit.closest(".nav-chats__item");
}

function like(event) {
  let parent = event.currentTarget;
  let counter = parent.lastElementChild;
  let svg = parent.firstElementChild;
  let value = +counter.innerHTML;

  if (!svg.classList.contains("like__svg_active")) {
    value += 1;
  }
  if (svg.classList.contains("like__svg_active")) {
    value -= 1;
  }
  counter.innerHTML = value;
  if (value == 0) {
    counter.innerHTML = "";
  }
  svg.classList.toggle("like__svg_active");
}

function cleanForm(form) {
  let formName = form.elements.letter__name;
  let checkbox = form.elements.checkbox;
  let text = form.elements.letter__text;

  formName.value = "";
  text.value = "";
  checkbox.checked = false;
  hideCalendar();
}

function makeMessage(msg) {
  let div = document.createElement("div");

  let day = formatDate(msg.enteredDate);
  let text = msg.text.replace(/\n/g, "<br />");

  div.className = "message";
  div.innerHTML = `
            <div class="message__name">${msg.name}</div>
            <div class="message__date">${day}</div>
            <div class="message__wrap">
              <div class="message__text">${text}</div>
              <div class="message__delete">
                <img
                  onclick="deleteMessage(event)"
                  src="./img/delete.svg"
                  alt="delete"
                />
              </div>
            </div>
            <div onclick="like(event)" class="like">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.63 2.4575C15.247 2.07426 14.7921 1.77024 14.2915 1.56282C13.7909 1.35539 13.2544 1.24863 12.7125 1.24863C12.1707 1.24863 11.6341 1.35539 11.1335 1.56282C10.6329 1.77024 10.1781 2.07426 9.79503 2.4575L9.00003 3.2525L8.20503 2.4575C7.43126 1.68373 6.3818 1.24904 5.28753 1.24904C4.19325 1.24904 3.1438 1.68373 2.37003 2.4575C1.59626 3.23127 1.16156 4.28073 1.16156 5.375C1.16156 6.46928 1.59626 7.51873 2.37003 8.2925L3.16503 9.0875L9.00003 14.9225L14.835 9.0875L15.63 8.2925C16.0133 7.90944 16.3173 7.45461 16.5247 6.95402C16.7321 6.45343 16.8389 5.91687 16.8389 5.375C16.8389 4.83314 16.7321 4.29658 16.5247 3.79599C16.3173 3.29539 16.0133 2.84057 15.63 2.4575V2.4575Z"
                  stroke="#7879F1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="like__counter"></span>
            </div>
          `;
  return div;
}

function getMessageFromForm(form) {
  let formName = form.elements.letter__name;
  let text = form.elements.letter__text;
  let createdDate = new Date();
  let mm = createdDate.getMinutes();
  let hh = createdDate.getHours();
  let value = `${calendar.value}T${hh}:${mm}:00`;
  let enteredDate =
    calendar.value == "" ? new Date(createdDate) : new Date(value);

  return {
    name: formName.value,
    text: text.value,
    createdDate,
    enteredDate,
  };
}

function formatDate(date) {
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  let enteredDate = date.toLocaleDateString("ru-RU", options).split(", ");
  let time = enteredDate[1];
  let day = enteredDate[0];

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  let pastHours = (currentDate - date) / (1000 * 60 * 60);

  switch (true) {
    case pastHours > 0 && pastHours < 24:
      return `вчера, в ${time}`;
      break;
    case pastHours < 0 && pastHours > -24:
      return `сегодня, в ${time}`;
      break;
    default:
      return `${day}, в ${time}`;
  }
}

function submitHandler(event) {
  event.preventDefault();
  let msg = getMessageFromForm(form);
  cleanForm(form);
  let div = makeMessage(msg);
  let communication = document.querySelector(".communication_active");
  communication.append(div);
  communication.scrollTop = communication.scrollHeight;
}

form.onsubmit = submitHandler;

document.addEventListener("keydown", (event) => {
  let text = form.elements.letter__text;
  if (event.key == "Enter" && document.activeElement != text) {
    submitHandler(event);
  }
});

let chatsList = document.querySelector(".nav-chats__box");
chatsList.onclick = function (event) {
  let chatDiv = event.target.closest(".nav-chats__item");
  // console.log(event.target);
  let btn = event.target.closest(".nav-chats__btn-change");
  if (chatDiv != null && event.target != btn) {
    Array.from(chatsList.children).forEach((element) => {
      element.classList.remove("nav-chats__item_active");
      let num = element.dataset.chat;
      let communication = document.querySelector(
        `.communication[data-chat='${num}']`
      );
      communication.classList.remove("communication_active");
    });
    chatDiv.classList.add("nav-chats__item_active");
    let num = chatDiv.dataset.chat;
    let communication = document.querySelector(
      `.communication[data-chat='${num}']`
    );
    communication.classList.add("communication_active");
  }
};

let btnAddChat = document.querySelector(".nav-chats__btn-add");

btnAddChat.onclick = function () {
  let navChats = Array.from(
    document.querySelectorAll(".nav-chats__item[data-chat]")
  );
  let chatNumber = 0;
  if (navChats.length > 0) {
    navChats.forEach((element) => {
      let num = Number(element.dataset.chat);
      chatNumber = num > chatNumber ? num : chatNumber;
    });
  }
  chatNumber = chatNumber + 1;

  let chat = document.createElement("div");
  chat.className = "nav-chats__item";
  chat.dataset.chat = chatNumber;
  chat.innerHTML = `<span>Чат${chatNumber + 1}</span>
      <div class="nav-chats__btn">
        <div class="nav-chats__edit">
          <img onclick="editChat(event)" src="./img/edit.svg" alt="edit" />
        </div>
        <div class="nav-chats__delete">
          <img
            width="24px"
            height="24px"
            onclick="deleteChat(event)"
            src="./img/delete.svg"
            alt="delete"
          />
        </div>
      </div>`;
  chatsList.append(chat);

  let comm = document.createElement("div");
  comm.className = "communication";
  comm.dataset.chat = chatNumber;

  let commList = document.querySelector(".messages-box__box");

  commList.append(comm);
};

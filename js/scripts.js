let form = document.forms.letter;
let checkbox = form.elements.checkbox;
let calendar = form.elements.letter__date;

function hideCalendar(form) {
  if (checkbox.checked == false) {
    calendar.hidden = true;
  }
  if (checkbox.checked == true) {
    calendar.hidden = false;
  }
}

hideCalendar(form);

checkbox.onchange = hideCalendar;

function deleteMessage(event) {
  let trash = this.event.currentTarget;
  let message = trash.parentNode.parentNode.parentNode;
  message.remove();
}

function like(event) {
  let parent = this.event.currentTarget;
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
  hideCalendar(form);
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
              <div class="message__trash">
                <img
                  onclick="deleteMessage()"
                  src="./img/trash.svg"
                  alt="trash"
                />
              </div>
            </div>
            <div onclick="like()" class="like">
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
  let communication = document.querySelector(".communication");
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

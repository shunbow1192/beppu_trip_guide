const buttons = document.querySelectorAll(".route-btn");
const contents = document.querySelectorAll(".route-content");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    // すべてのボタンを通常状態にする
    buttons.forEach(btn => btn.classList.remove("active"));

    // 押したボタンだけを選択状態にする
    button.classList.add("active");

    // 表示する内容を切り替える
    contents.forEach(content => {
      content.hidden = content.id !== button.dataset.route;
    });
  });
});

const spotButtons = document.querySelectorAll(".spot-btn");
const spotContents = document.querySelectorAll(".spot-content");

spotButtons.forEach(button => {
  button.addEventListener("click", () => {
    spotButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    spotContents.forEach(content => {
      content.hidden =
        content.id !== button.dataset.category;
    });
  });
});
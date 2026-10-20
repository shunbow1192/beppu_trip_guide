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

/* ==================================
   お気に入り機能
================================== */

const FAVORITES_KEY = "oita-travel-favorites-v1";

const favoriteContainer = document.getElementById("favorites");

// 既存のお気に入り情報を読み込む
let favorites = [];

try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY));

    if (Array.isArray(saved)) {
        favorites = saved;
    }
} catch (error) {
    favorites = [];
}

// 5ジャンルのスポットを取得
const categories = [
    "gourmet",
    "sweets",
    "ramen",
    "onsen",
    "sightseeing"
];

const allSpots = [];

// 各スポットにお気に入りボタンを追加
categories.forEach(category => {

    const container = document.getElementById(category);

    if (!container) return;

    const spots = container.querySelectorAll(":scope > div");

    spots.forEach((spot, index) => {

        // スポットごとに固有IDを設定
        const spotId = `${category}-${index}`;

        spot.dataset.spotId = spotId;

        allSpots.push(spot);

        // お気に入りボタンを作成
        const button = document.createElement("button");

        button.className = "favorite-btn";
        button.type = "button";

        button.dataset.favoriteId = spotId;

        button.addEventListener("click", () => {
            toggleFavorite(spotId);
        });

        spot.appendChild(button);

    });

});

// お気に入りの登録・解除
function toggleFavorite(spotId) {

    if (favorites.includes(spotId)) {

        favorites = favorites.filter(id => id !== spotId);

    } else {

        favorites.push(spotId);

    }

    // ブラウザに保存
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

    updateFavoriteButtons();
    renderFavorites();
}

// ハートの表示を更新
function updateFavoriteButtons() {

    document.querySelectorAll(".favorite-btn").forEach(button => {

        const isFavorite = favorites.includes(
            button.dataset.favoriteId
        );

        button.classList.toggle(
            "is-favorite",
            isFavorite
        );

        button.textContent = isFavorite ? "♥" : "♡";

        button.setAttribute(
            "aria-label",
            isFavorite ? "お気に入り解除" : "お気に入り登録"
        );

        button.setAttribute(
            "aria-pressed",
            String(isFavorite)
        );

    });

}

// お気に入り一覧を表示
function renderFavorites() {

    favoriteContainer.innerHTML = "";

    const selectedSpots = allSpots.filter(spot => {
        return favorites.includes(spot.dataset.spotId);
    });

    // お気に入りがない場合
    if (selectedSpots.length === 0) {

        const message = document.createElement("p");

        message.className = "favorites-empty";

        message.textContent =
            "まだお気に入りが登録されていません。";

        favoriteContainer.appendChild(message);

        return;
    }

    // 登録されたスポットを表示
    selectedSpots.forEach(spot => {

        const clone = spot.cloneNode(true);

        // 複製したボタンにクリック機能を追加
        const button = clone.querySelector(".favorite-btn");

        if (button) {

            button.addEventListener("click", () => {
                toggleFavorite(spot.dataset.spotId);
            });

        }

        favoriteContainer.appendChild(clone);

    });

    updateFavoriteButtons();

}

// 初期表示
updateFavoriteButtons();
renderFavorites();
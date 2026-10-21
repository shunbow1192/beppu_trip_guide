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


/* ==================================
   観光スポットに戻るボタン
================================== */

const backToTop = document.getElementById("back-to-top");
const spotsHeading = document.getElementById("spots-heading");

// 観光スポットの見出しを通過したら表示
function updateBackToTop() {
  const headingBottom =
    spotsHeading.getBoundingClientRect().bottom;

  backToTop.classList.toggle(
    "show",
    headingBottom < 0
  );
}

// スクロール時に表示状態を更新
window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

// 読み込み時にも確認
updateBackToTop();

// クリックすると観光スポットの見出しへ移動
backToTop.addEventListener("click", () => {
  spotsHeading.scrollIntoView({
    behavior: window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? "instant" : "smooth",
    block: "start"
  });
});


/* ==================================
   写真の拡大表示・切り替え機能
================================== */

// 拡大表示用の背景
const photoLightbox = document.createElement("div");
photoLightbox.className = "photo-lightbox";
photoLightbox.hidden = true;
photoLightbox.style.display = "none";

// 拡大表示する写真
const enlargedPhoto = document.createElement("img");
enlargedPhoto.alt = "";

// 閉じるボタン
const lightboxClose = document.createElement("button");
lightboxClose.className = "photo-lightbox-close";
lightboxClose.type = "button";
lightboxClose.textContent = "×";
lightboxClose.setAttribute("aria-label", "写真を閉じる");

// 前の写真ボタン
const photoPrev = document.createElement("button");
photoPrev.className =
  "photo-lightbox-nav photo-lightbox-prev";
photoPrev.type = "button";
photoPrev.textContent = "‹";
photoPrev.setAttribute("aria-label", "前の写真");

// 次の写真ボタン
const photoNext = document.createElement("button");
photoNext.className =
  "photo-lightbox-nav photo-lightbox-next";
photoNext.type = "button";
photoNext.textContent = "›";
photoNext.setAttribute("aria-label", "次の写真");

// 枚数表示
const photoCounter = document.createElement("div");
photoCounter.className = "photo-lightbox-counter";

// 要素を追加
photoLightbox.appendChild(enlargedPhoto);
photoLightbox.appendChild(lightboxClose);
photoLightbox.appendChild(photoPrev);
photoLightbox.appendChild(photoNext);
photoLightbox.appendChild(photoCounter);
document.body.appendChild(photoLightbox);

// 現在表示している写真グループ
let lightboxPhotos = [];
let lightboxIndex = 0;

// 開く前のスクロール設定を保存
let previousBodyOverflow = "";

// 写真を更新
function updateLightboxPhoto() {
  const img = lightboxPhotos[lightboxIndex];
  if (!img) return;

  enlargedPhoto.src = img.currentSrc || img.src;
  enlargedPhoto.alt = img.alt || "";

  // 枚数表示
  photoCounter.textContent =
    `${lightboxIndex + 1} / ${lightboxPhotos.length}`;

  // 1枚だけなら矢印を非表示
  const hasMultiple = lightboxPhotos.length > 1;
  photoPrev.disabled = !hasMultiple;
  photoNext.disabled = !hasMultiple;
}

// 写真を拡大する
function openPhotoLightbox(img) {
  // タップした写真と同じスライダー内の写真を取得
  const slider = img.closest(".photo-slider");

  lightboxPhotos = Array.from(
    slider.querySelectorAll("img")
  );

  lightboxIndex = lightboxPhotos.indexOf(img);

  if (lightboxIndex < 0) lightboxIndex = 0;

  updateLightboxPhoto();

  photoLightbox.hidden = false;
  photoLightbox.style.display = "flex";

  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
}

// 拡大表示を閉じる
function closePhotoLightbox() {
  photoLightbox.hidden = true;
  photoLightbox.style.display = "none";

  document.body.style.overflow = previousBodyOverflow;
}

// 次・前の写真へ切り替え
function changeLightboxPhoto(direction) {
  if (lightboxPhotos.length <= 1) return;

  lightboxIndex =
    (lightboxIndex + direction + lightboxPhotos.length)
    % lightboxPhotos.length;

  updateLightboxPhoto();
}

// 写真をクリックしたら拡大
document.addEventListener("click", (event) => {
  const img = event.target.closest(".photo-slider img");

  if (img) {
    openPhotoLightbox(img);
  }
});

// 左右ボタン
photoPrev.addEventListener("click", () => {
  changeLightboxPhoto(-1);
});

photoNext.addEventListener("click", () => {
  changeLightboxPhoto(1);
});

// ×ボタン
lightboxClose.addEventListener("click", closePhotoLightbox);

// 背景タップで閉じる
photoLightbox.addEventListener("click", (event) => {
  if (event.target === photoLightbox) {
    closePhotoLightbox();
  }
});

// キーボード操作
document.addEventListener("keydown", (event) => {
  if (photoLightbox.hidden) return;

  if (event.key === "Escape") {
    closePhotoLightbox();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    changeLightboxPhoto(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    changeLightboxPhoto(1);
  }
});

// スマホのスワイプ操作
let touchStartX = 0;
let touchStartY = 0;

photoLightbox.addEventListener("touchstart", (event) => {
  if (event.touches.length !== 1) return;

  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}, { passive: true });

photoLightbox.addEventListener("touchend", (event) => {
  if (photoLightbox.hidden) return;
  if (event.changedTouches.length !== 1) return;

  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // 横方向に50px以上動いた場合だけ切り替え
  if (
    Math.abs(diffX) > 50 &&
    Math.abs(diffX) > Math.abs(diffY)
  ) {
    if (diffX < 0) {
      changeLightboxPhoto(1);
    } else {
      changeLightboxPhoto(-1);
    }
  }
}, { passive: true });

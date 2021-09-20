import "./style.css";

const toDomUl = document.getElementById("js-parent");
const URL = "https://jsondata.okiba.me/v1/json/ESt5M210611071002";

//カテゴリタブ
const tabsUl = document.createElement("ul");
tabsUl.classList.add("tabs");
const tabsContainerLi = document.createElement("li");
tabsContainerLi.classList.add("tabs_container");
const tabsFragment = document.createDocumentFragment();

//カテゴリ記事
const tabContentsUl = document.createElement("ul");
tabContentsUl.classList.add("tab_contents");
const tabContentsContainerLi = document.createElement("li");
tabContentsContainerLi.classList.add("tab_contents_container");
const contentsFragment = document.createDocumentFragment();

//カテゴリタブ・記事をDOMへ
toDomUl?.prepend(tabsContainerLi);
toDomUl?.appendChild(tabContentsContainerLi).appendChild(tabContentsUl);
tabsContainerLi.appendChild(tabsUl);

type DataResult = {
  data: [
    {
      category: string;
      id: string;
      articles: [
        {
          id: string;
          title: string;
          commentCount: string;
          isNew: boolean;
        }
      ];
      img: string;
      isActive: boolean;
    }
  ];
};

type FetchContentsData = () => Promise<DataResult | null>;
const fetchContentsData: FetchContentsData = async () => {
  try {
    const response = await fetch(URL);
    const jsonData: DataResult = await response.json();
    return jsonData;
  } catch (err) {
    //errがJavaScript エンジンでの内部エラーだったら
    if (err instanceof Error) {
      throw Error(err.message);
    }
    return null;
  } finally {
    console.log("終了しました");
  }
};

type CreateContents = (data: DataResult) => void;

export const createOfTab: CreateContents = ({ data }) => {
  data.reduce((prev, _current, index) => {
    const tabItemLi = document.createElement("li");
    tabItemLi.classList.add("tab_item");
    tabItemLi.dataset.id = data[index].id;
    tabItemLi.textContent = data[index].category;
    tabsFragment.appendChild(tabItemLi);
    return prev;
  }, []);
  tabsUl.appendChild(tabsFragment);
};

export const createOfTabContents: CreateContents = ({ data }) => {
  data.reduce((prev, _current, index) => {
    const tabContentLi = document.createElement("li");
    tabContentLi.classList.add("tab_content");
    tabContentLi.id = data[index].id;
    const tabContentDescriptionUl = document.createElement("ul");
    for (let i = 0; i < data[index].articles.length; i++) {
      const tabContentDescriptionLi = document.createElement("li");
      tabContentDescriptionLi.classList.add("tab_content-description_li");
      const tabContentDescriptionArticle = document.createElement("article");
      tabContentDescriptionArticle.classList.add(
        "tab_content-description_Article"
      );
      const tabContentDescriptionP = document.createElement("p");
      tabContentDescriptionP.id = `${data[index].id}-title_no${i}`;
      tabContentDescriptionUl
        .appendChild(tabContentDescriptionLi)
        .appendChild(tabContentDescriptionArticle)
        .appendChild(tabContentDescriptionP).textContent =
        data[index].articles[i].title;
    }
    contentsFragment
      .appendChild(tabContentLi)
      .appendChild(tabContentDescriptionUl);
    return prev;
  }, []);
  tabContentsContainerLi
    .appendChild(tabContentsUl)
    .appendChild(contentsFragment);
};

export const displayOfCategoryImage: CreateContents = ({ data }) => {
  data.reduce((prev, _current, index) => {
    const tabContentList = document.getElementById(`${data[index].id}`);
    const tabContentImgP = document.createElement("p");
    tabContentImgP.classList.add("tab_content_img");
    const img = document.createElement("img");
    tabContentList?.appendChild(tabContentImgP);
    tabContentImgP.appendChild(img).src = data[index].img;
    return prev;
  }, []);
};

export const addIsNewIcon: CreateContents = ({ data }) => {
  data.reduce((prev, _current, index) => {
    for (let i = 0; i < data[index].articles.length; i++) {
      const setIsNew = data[index].articles[i].isNew;
      const tabContentDescriptionP = document.getElementById(
        `${data[index].id}-title_no${i}`
      );
      const isNewContent = document.createElement("span");
      if (setIsNew === true) {
        tabContentDescriptionP?.appendChild(isNewContent);
        isNewContent.classList.add("new");
        isNewContent.textContent = "new";
      }
    }
    return prev;
  }, []);
};

export const numberOfDisplayComments: CreateContents = ({ data }) => {
  data.reduce((prev, _current, index) => {
    for (let i = 0; i < data[index].articles.length; i++) {
      const setCommentCount = data[index].articles[i].commentCount;
      const tabContentDescriptionP = document.getElementById(
        `${data[index].id}-title_no${i}`
      );
      const comment = document.createElement("span");
      comment.classList.add("comment");
      const commentImg = document.createElement("img");
      if (setCommentCount) {
        comment.textContent = setCommentCount;
        tabContentDescriptionP?.appendChild(commentImg);
        commentImg.src = "../comment.png";
        tabContentDescriptionP?.appendChild(comment);
      }
    }
    return prev;
  }, []);
};

export const InitialSettingOfTab: CreateContents = ({ data }) => {
  const tabTriggers = document.querySelectorAll(".tab_item");
  const tabTargets = document.querySelectorAll(".tab_content");
  data.reduce((prev, _current, index) => {
    if (data[index].isActive == true) {
      tabTriggers[index].classList.add("is-active");
      tabTargets[index].classList.add("is-show");
    } else {
      tabTriggers[index].classList.remove("is-active");
    }
    return prev;
  }, []);
};

const tabSwitch = (): void => {
  const tabTriggers = document.querySelectorAll(".tab_item");
  const tabTargets = document.querySelectorAll(".tab_content");

  tabTriggers.forEach((tabTrigger) => {
    tabTrigger.addEventListener("click", ({ currentTarget }: Event) => {
      if (currentTarget instanceof HTMLElement) {
        const id = currentTarget.dataset.id;
        if (id) {
          const currentContent = document.getElementById(id);
          tabTriggers.forEach((tabTrigger) => {
            tabTrigger.classList.remove("is-active");
          });
          currentTarget.classList.add("is-active");

          tabTargets.forEach((tabTarget) => {
            tabTarget.classList.remove("is-show");
          });
          currentContent?.classList.add("is-show");
        }
      }
    });
  });
};

export const createElements: CreateContents = (data) => {
  createOfTab(data);
  createOfTabContents(data);
  displayOfCategoryImage(data);
  InitialSettingOfTab(data);
  addIsNewIcon(data);
  numberOfDisplayComments(data);
  tabSwitch();
};

const init = async (): Promise<void> => {
  try {
    const data: DataResult | null = await fetchContentsData();
    if (data) {
      createElements(data);
    } else {
      tabsUl.innerHTML = "data is empty";
    }
  } catch (e) {
    tabsUl.innerHTML = `error is ${e}`;
  }
};
init();

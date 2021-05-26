/** ***************전역*************** **/
let isAuth = false;
const COMMENTS = 'comments';
let comments = [
  {
    comment_idx: 1,
    reg_id: 'admin',
    reg_date: new Date().getTime(),
    comment_contents: '정말 멋진 생각입니다',
    like: 1,
    dislike: 2,
  },
  {
    comment_idx: 2,
    reg_id: 'new1',
    reg_date: new Date().getTime(),
    comment_contents: '저는 그렇게 생각 안합니다.',
    like: 10,
    dislike: 9,
  },
];

/** ***************이벤트 발생*************** **/
init();

//댓글 입력시 로그인 유무 모달 띄우기
document.querySelector('.make_reply').addEventListener('focus', modalShow);

//로그인 버튼 클릭시 모달 지우기
document.querySelectorAll('.btn_login').forEach((targetBtn) => {
  targetBtn.addEventListener('click', hideBackground);
});
//등록 버튼 클릭시 댓글 추가하기
document
  .querySelector('.push_reply')
  .addEventListener('click', () =>
    isAuthHOC(addComment.bind(document.querySelector('.push_reply')))
  );

/** ***************이벤트 콜백*************** **/
function modalShow() {
  if (!isAuth) {
    document.querySelector('.modal_login_wrapper').classList.add('display');
    document.querySelector('.modal_login').classList.add('show');
  }
}
function hideBackground() {
  isAuth = true;
  document.querySelector('.modal_login_wrapper').style.display = 'none';
  document.querySelector('.modal_login').style.display = 'none';
  alert('로그인 되었습니다');
}
function toggleMore(el) {
  el.firstElementChild.classList.toggle('show');
}

/** ***************사용자 함수*************** **/

function init() {
  saveComment();
  loadComments();
}

//로컬 스토리지에 정보 저장
function saveComment() {
  localStorage.setItem(COMMENTS, JSON.stringify(comments));
}

//댓글 불러오기
function loadComments() {
  const loadedComments = localStorage.getItem(COMMENTS);
  //로컬 스토리지에 COMMENTS 가 있는지 확인
  if (loadedComments) {
    const parsedComments = JSON.parse(loadedComments);
    loadComment(parsedComments);
  }
}
//댓글 제거하기
function removeComment(el) {
  let id = parseInt(
    el.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
  );
  const filterdComments = comments.filter((item) => item.comment_idx !== id);
  console.log(id);
  comments = filterdComments;
  saveComment();
  loadComments();
}

//댓글 수정하기
function editComment(el) {
  document.querySelector('.modal_edit_wrapper').classList.add('show');
  let oldText =
    el.parentNode.parentNode.parentNode.nextElementSibling.textContent;
  document.querySelector('.edit_contents').value = oldText;

  let id = parseInt(
    el.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
  );
  document
    .querySelector('.btn_edit')
    .addEventListener('click', pushEditedComment);
  function pushEditedComment() {
    let newText = document.querySelector('.edit_contents').value;
    const editedComments = comments.map((item) =>
      item.comment_idx === id ? { ...item, comment_contents: newText } : item
    );
    comments = editedComments;
    saveComment();
    loadComments();
    document.querySelector('.modal_edit_wrapper').classList.remove('show');
  }
}

//댓글 추가하기
function addComment() {
  console.log(this);
  //공백을 제거한 문자열
  const text = document
    .querySelector('.make_reply')
    .value.replace(/(\s*)/g, '');

  if (text.includes('면접탈락')) {
    alert('면접탈락은 사용 할수 없는 금지어 입니다');
    return;
  }
  comments.push({
    comment_idx: comments[comments.length - 1].comment_idx + 1,
    reg_id: 'admin',
    reg_date: new Date().getTime(),
    comment_contents: text,
    like: 0,
    dislike: 0,
  });
  document.querySelector('.make_reply').value = '';
  saveComment();
  loadComments();
  this.style.background = 'blue';
  this.setAttribute('disabled', 'disabled');
  setTimeout(() => {
    this.removeAttribute('disabled');
    this.style.background = 'red';
  }, 3000);
}

//댓글 그리기
function loadComment(data) {
  for (let i = 0, html = ''; i < data.length; i++) {
    html += '<div class="single_reply" id="' + data[i].comment_idx + '">';
    html += '<div class="user_info_wrapper">';
    html += '<div class="user_info">';
    html += '<i class="fas fa-level-up-alt"></i>';
    html += '<div class="avatar">';
    html += '<img src="./img/react.png" alt="avatar" />';
    html += '</div>';
    html += '<div class="sns_icon">';
    html += '<img src="./img/vue.png" alt="sns_icon" />';
    html += '</div>';
    html += '<div class="name">' + data[i].reg_id + '</div>';
    html += '<div class="time">한시간 전</div>';
    html += '</div>';
    html += '<div class="more"onclick="isAuthHOC(toggleMore(this))" >&hellip;';
    html +=
      '<div class="more-wrap"><span class="more_btn_edit" onclick="editComment(this)">수정하기</span><span class="more_btn_remove" onclick="removeComment(this)">삭제하기</span></div>';

    html += '</div></div>';
    html += '<div class="content">' + data[i].comment_contents + '</div>';
    html += '<div class="reply_and_like">';
    html += '<div class="total_reply">';
    html += '<i class="far fa-comment-dots"></i>8';
    html += '</div>';
    html += '<div class="like-wrap">';
    html +=
      '<div class="like"><i class="far fa-thumbs-up"></i>' +
      data[i].like +
      '</div>';
    html +=
      '<div class="dislike"><i class="far fa-thumbs-down"></i>' +
      data[i].dislike +
      '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    document.querySelector('.reply_wrap').innerHTML = html;
  }
}

function isAuthHOC(fn) {
  if (!isAuth) {
    //로그인 하지 않았다면
    modalShow();
  } else {
    //로그인 했다면
    fn();
  }
}

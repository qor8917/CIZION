/** ***************전역*************** **/
let isAuth = false;
const COMMENTS = 'comments';
let comments = [
  {
    comment_idx: 1,
    reg_id: 'admin',
    reg_date: 1622041351211,
    comment_contents: '정말 멋진 생각입니다',
    like: 0,
    dislike: 0,
    like_done: false,
    dislike_done: false,
  },
  {
    comment_idx: 2,
    reg_id: 'new1',
    reg_date: 1622049075447,
    comment_contents: '저는 그렇게 생각 안합니다.',
    like: 0,
    dislike: 0,
    like_done: false,
    dislike_done: false,
  },
];

/** ***************이벤트 발생*************** **/
//최초 로딩
saveComment();
loadComments();

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

//로컬 스토리지에 데이터 저장
function saveComment() {
  localStorage.setItem(COMMENTS, JSON.stringify(comments));
}

//로컬 스토리지에서 데이터 불러오기
function loadComments() {
  const loadedComments = localStorage.getItem(COMMENTS);
  //로컬 스토리지에 COMMENTS 가 있는지 확인
  if (loadedComments) {
    let parsedComments = JSON.parse(loadedComments);
    loadComment(parsedComments);
    //총 댓글 갯수 저장
    document.querySelector('.total_comments').textContent =
      parsedComments.length;
    //총 좋아요 갯수 저장
    document.querySelector('.like_total_num').textContent = total_like();
    //총 싫어요 갯수 저장
    document.querySelector('.dislike_total_num').textContent = total_dislike();
    //총 좋아요 갯수 계산
    function total_like() {
      let total = 0;
      for (var i = 0; i < parsedComments.length; i++) {
        total += parsedComments[i].like;
      }
      return total;
    }
    //총 싫어요 갯수 계산
    function total_dislike() {
      let total = 0;
      for (let i = 0; i < parsedComments.length; i++) {
        total += parsedComments[i].dislike;
      }
      return total;
    }
  }
}
//댓글 제거하기
function removeComment(el) {
  let id = parseInt(
    el.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
  );
  //데이터 수정
  const filterdComments = comments.filter((item) => item.comment_idx !== id);
  console.log(id);
  comments = filterdComments;
  //재로딩
  saveComment();
  loadComments();
}

//댓글 수정하기
function editComment(el) {
  //댓글 수정창 띄우기
  document.querySelector('.modal_edit_wrapper').classList.add('show');
  //수정하려는 기존 텍스트 보여주기
  let oldText =
    el.parentNode.parentNode.parentNode.nextElementSibling.textContent;
  document.querySelector('.edit_contents').value = oldText;
  let id = parseInt(
    el.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
  );
  //수정 버튼 누르면 할일
  document
    .querySelector('.btn_edit')
    .addEventListener('click', pushEditedComment);
  function pushEditedComment() {
    //새로운 텍스트 데이터에 넣기
    let newText = document.querySelector('.edit_contents').value;
    const editedComments = comments.map((item) =>
      item.comment_idx === id ? { ...item, comment_contents: newText } : item
    );
    comments = editedComments;
    //댓글 재로딩
    saveComment();
    loadComments();
    //댓글 수정창 감춤
    document.querySelector('.modal_edit_wrapper').classList.remove('show');
  }
}

//댓글 추가하기
function addComment() {
  //시간 저장
  let time = new Date().getTime();
  //공백을 제거한 문자열
  const text = document
    .querySelector('.make_reply')
    .value.replace(/(\s*)/g, '');
  //금지어 지정

  if (text.includes('면접탈락')) {
    alert('면접탈락은 사용 할수 없는 금지어 입니다');
    return;
  }
  if (!text) {
    alert('빈공백은 댓글을 다실 수 없습니다');
    return;
  }
  //데이터 삽입
  comments.push({
    comment_idx: comments[comments.length - 1].comment_idx + 1,
    reg_id: 'admin',
    reg_date: time,
    comment_contents: text,
    like: 0,
    dislike: 0,
    like_done: false,
    dislike_done: false,
  });
  //재로딩
  saveComment();
  loadComments();
  //버튼 비활성화
  this.style.background = 'blue';
  this.setAttribute('disabled', 'disabled');
  //input 태그 초기화
  document.querySelector('.make_reply').value = '';
  //3초뒤에 버튼 활성화
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
    html += '<div class="time">' + time(data[i].reg_date) + ' 시간 전</div>';
    html += '</div>';
    html +=
      '<div class="more"onclick="isAuthHOC(()=>toggleMore(this))" >&hellip;';
    html +=
      '<div class="more-wrap"><span class="more_btn_edit" onclick="editComment(this)">수정하기</span><span class="more_btn_remove" onclick="removeComment(this)">삭제하기</span></div>';

    html += '</div></div>';
    html += '<div class="content">' + data[i].comment_contents + '</div>';
    html += '<div class="reply_and_like">';
    html += '<div class="total_reply">';
    html += '<i class="far fa-comment-dots"></i>0';
    html += '</div>';
    html += '<div class="like-wrap">';
    html +=
      '<div class="like" onclick="btn_like(this)"><i class="far fa-thumbs-up"></i>' +
      data[i].like +
      '</div>';
    html +=
      '<div class="dislike" onclick="btn_dislike(this)"><i class="far fa-thumbs-down"></i>' +
      data[i].dislike +
      '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    document.querySelector('.reply_wrap').innerHTML = html;
  }
}
//좋아요
function btn_like(el) {
  let id = parseInt(el.parentNode.parentNode.parentNode.getAttribute('id'));
  //좋아요를 한번누르면 중복해서 좋아요 할 수 없음
  if (!comments[id - 1].like_done) {
    comments[id - 1].like = comments[id - 1].like + 1;
    comments[id - 1].like_done = true;
  } else {
    //이미 좋아요를 누른 상태면 좋아요 취소
    comments[id - 1].like = comments[id - 1].like - 1;
    comments[id - 1].like_done = false;
  }
  saveComment();
  loadComments();
}
//싫어요
function btn_dislike(el) {
  let id = parseInt(el.parentNode.parentNode.parentNode.getAttribute('id'));
  //싫어요를 한번누르면 중복해서 싫어요 할 수 없음
  if (!comments[id - 1].dislike_done) {
    comments[id - 1].dislike = comments[id - 1].dislike + 1;
    comments[id - 1].dislike_done = true;
  } else {
    //이미 싫어요를 누른 상태면 싫어요 취소
    comments[id - 1].dislike = comments[id - 1].dislike - 1;
    comments[id - 1].dislike_done = false;
  }
  saveComment();
  loadComments();
}

//로그인 유무
function isAuthHOC(fn) {
  if (!isAuth) {
    //로그인 하지 않았다면
    modalShow();
  } else {
    //로그인 했다면

    fn();
  }
}

//시간계산
function time(reg_date) {
  let difference = new Date().getTime() - reg_date;
  let min = Math.floor(difference / 1000 / 60 / 60);
  return min;
}

console.log(new Date().getTime());

import * as likeApi from './modules/likeApi.js';
import * as commentApi from './modules/commentApi.js';

// 전역 변수 설정
let currentPage = 1;      // 현재 페이지 번호를 관리하는 변수
let isLoading = false;    // 현재 페이지를 불러오는 중인지 여부를 저장할 변수
let hasNext = true;       // 다음 페이지 존재여부 저장할 변수

{
  // DOM 요소
  const $likeBtn = document.querySelector('.like-btn');
  const $deleteBtn = document.querySelector('.delete-btn');
  const $commentForm = document.querySelector('.comment-form');
  const $commentInput = document.querySelector('.comment-input');
  const $commentList = document.querySelector('.comment-list');

  { // 진입과 동시에 좋아요 체크
    likeApi.checkLike(freeBoardId, function (data) {
      console.log(data);
      // TODO: 전달받은 데이터를 활용하여 좋아요 버튼의 상태와 좋아요 수 반영하기!
      const $likeCount = document.querySelector('.like-count');
      $likeCount.textContent = data.likeCount;

      if (data.liked) {
        $likeBtn.classList.add('active');
      } else {
        $likeBtn.classList.remove('active');
      }
    });
  }

  // 좋아요 버튼 클릭
  $likeBtn.addEventListener('click', function () {
    // this.classList.toggle('active'); // 조건에 따라 active를 토글하도록 변경
    const $likeCount = this.querySelector('.like-count');
    // const currentCount = parseInt($likeCount.textContent);

    // TODO: 서버에 좋아요 토글 처리, 반영된 결과 다시 조회해서 화면 처리
    likeApi.toggleLike(freeBoardId, function (data) {
      console.log(data);
      if (!data.success) {
        alert(data.message);
        return;
      }

      if (data.liked) {
        $likeBtn.classList.add('active');
      } else {
        $likeBtn.classList.remove('active');
      }

      $likeCount.textContent = data.likeCount;

    });
  });

  // 게시글 삭제
  // JS, 타임리프는 .? 을 제공한다.
  // .? : 옵셔널 체이닝 연산자
  // 특정 객체에 접근할 때 null, undefined 인지 확인해야 함
  // 자바의 경우 옵셔널 객체를 사용한다.
  // JS의 경우 옵셔널 체이닝 연산자를 활용하여, 해당 객체가 null이 아닌경우에만 접근하도록 자동 처리
  $deleteBtn?.addEventListener('click', function () {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: 서버에 삭제 요청
      console.dir(this)
      const boardId = this.dataset.boardId;
      location.href = `/board/free/delete?freeBoardId=${boardId}`;
    }
  });

  // 페이지 진입과 동시에 호출
  loadComments();

  function loadComments() {
    if (isLoading || !hasNext) {
      return;
    }

    isLoading = true;

    // 페이지 진입 후 댓글 목록 가져오기
    commentApi.getCommentList(freeBoardId, currentPage, function (data) {
      console.log(data);
      displayCommentList(data);

      // 상태 업데이트
      hasNext = data.sliceDTO.hasNext;
      if(hasNext) {
        currentPage++;
      }

      isLoading = false;
    });
  }

  // 스크롤 이벤트 처리
  window.addEventListener('scroll', function () {
    // 현재 문서의 높이
    const documentHeight = document.documentElement.scrollHeight;
    // 현재 보이는 화면의 높이
    const windowHeight = window.innerHeight;
    // 현재 스크롤 위치
    const scrollTop = window.scrollY;

    // 스크롤이 문서 하단에 도달했는지 체크 (여유값 100px)
    if(documentHeight - (windowHeight + scrollTop) < 100) {
      loadComments();
    }
  });

  function displayCommentList(obj) {
    const $commentCount = document.querySelector('.comment-count');
    $commentCount.textContent = obj.total;

    let html = '';

    obj.sliceDTO.list.forEach(comment => {
      html += `
      <li class="comment-item">
        <article class="comment-article">
          <div class="comment-info">
            <span class="writer">${comment.loginId}</span>
            <span class="date">${timeForToday(comment.regDate)}</span>
          </div>
          <p class="comment-text">${comment.content}</p>
          `;

      if (comment.memberId == loginMemberId) {
        html +=`
          <div class="comment-actions">
            <button type="button" class="edit-comment-btn" data-comment-id="${comment.freeCommentId}">수정</button>
            <button type="button" class="delete-comment-btn" data-comment-id="${comment.freeCommentId}">삭제</button>
          </div>
          `;
      }


      html += `
        </article>
      </li>
      `;
    });

    $commentList.innerHTML += html;

  }
  
  // 댓글 작성
  $commentForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const content = $commentInput.value.trim();
    if (!content) {
      alert('댓글 내용을 입력해주세요.');
      $commentInput.focus();
      return;
    }

    // TODO: 서버에 댓글 작성 요청
    // 성공 시 댓글 목록 새로고침
    const commentObj = {
      content : content
    };
    commentApi.postComment(freeBoardId, commentObj, function() {
      // TODO : 작성 성공후 처리
      $commentInput.value = '';

      // 페이지 초기화 후 다시 로딩
      currentPage = 1;
      hasNext = true;
      isLoading = false;
      $commentList.innerHTML = '';
      loadComments();
    });
  });

  // 댓글 수정
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-comment-btn')) {
      const $commentArticle = e.target.closest('.comment-article');
      const $commentText = $commentArticle.querySelector('.comment-text');
      const currentText = $commentText.textContent;

      // 이미 수정 중인 상태라면 리턴
      if ($commentArticle.classList.contains('editing')) return;

      // 수정 폼 생성
      const $editForm = document.createElement('form');
      $editForm.className = 'edit-form';
      $editForm.dataset.commentId = e.target.dataset.commentId;
      $editForm.innerHTML = `
          <textarea class="edit-input">${currentText}</textarea>
          <div class="edit-actions">
              <button type="submit" class="save-btn">저장</button>
              <button type="button" class="cancel-btn">취소</button>
          </div>
      `;

      // 수정 상태로 변경
      $commentArticle.classList.add('editing');
      $commentText.style.display = 'none';
      $commentText.after($editForm);

      const $editInput = $editForm.querySelector('.edit-input');
      $editInput.focus();

      // 취소 버튼 클릭
      $editForm.querySelector('.cancel-btn').addEventListener('click', function () {
        $commentArticle.classList.remove('editing');
        $commentText.style.display = '';
        $editForm.remove();
      });

      // 수정 폼 제출
      $editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newText = $editInput.value.trim();
        if (!newText) {
          alert('댓글 내용을 입력해주세요.');
          $editInput.focus();
          return;
        }

        // TODO: 서버에 수정 요청
        const commentObj = {
          content: newText,
        }

        const commentId = e.target.dataset.commentId;

        commentApi.patchComment(commentId, commentObj, function () {
          currentPage = 1;
          hasNext = true;
          isLoading = false;
          $commentList.innerHTML = '';
          loadComments();
        });
        // $commentText.textContent = newText;
        // $commentArticle.classList.remove('editing');
        // $commentText.style.display = '';
        // $editForm.remove();
      });
    }
  });

  // 댓글 삭제
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-comment-btn')) {
      if (confirm('댓글을 삭제하시겠습니까?')) {
        // const $commentItem = e.target.closest('.comment-item');
        // TODO: 서버에 삭제 요청
        // $commentItem.remove();
        // console.dir(e.target)
        const commentId = e.target.dataset.commentId;
        commentApi.deleteComment(commentId, function () {
          currentPage = 1;
          hasNext = true;
          isLoading = false;
          $commentList.innerHTML = '';
          loadComments();
        });
      }
    }
  });
}

// 댓글 시간 처리
function timeForToday(value) {
  const today = new Date();
  const timeValue = new Date(value);

  // console.log(today.getTime());
  // console.log(timeValue.getTime());

  // getTime()은 1970년 01/01 을 기준으로 지금까지 몇 ms가 지났는지 반환
  // Math.floor()는 소수점을 내림 처리 해준다.

  // 댓글 작성 시간과 현재 시간의 차이 (분 단위)
  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);

  if (betweenTime < 1) { return "방금 전"; }

  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTimeHour / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
}





















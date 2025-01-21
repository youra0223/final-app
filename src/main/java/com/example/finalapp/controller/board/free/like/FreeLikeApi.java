package com.example.finalapp.controller.board.free.like;

import com.example.finalapp.service.board.free.like.FreeLikeService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FreeLikeApi {
    private final FreeLikeService freeLikeService;

    @Getter @ToString @AllArgsConstructor(access = AccessLevel.PRIVATE)
    public static class LikeResponse {
        private boolean liked;
        private int likeCount;
        private String message;
        private boolean success;

        public static LikeResponse error(boolean liked, int likeCount, String message) {
            return new LikeResponse(liked, likeCount, message, false);
        }

        public static LikeResponse success(boolean liked, int likeCount, String message) {
            return new LikeResponse(liked, likeCount, message, true);
        }
    }

    @GetMapping("/v1/free-boards/{freeBoardId}/likes/check")
    public LikeResponse checkLikeStatus(
            @PathVariable("freeBoardId") Long freeBoardId,
            @SessionAttribute(value = "memberId", required = false) Long memberId
    ) {
        FreeLikeService.FreeLikeResult result = freeLikeService.isLikedByMember(memberId, freeBoardId);

        return LikeResponse.success(result.isLiked(), result.getLikeCount(), "확인 완료!");
    }

    @PutMapping("/v1/free-boards/{freeBoardId}/likes")
    public LikeResponse putLike(
            @PathVariable("freeBoardId") Long freeBoardId,
            @SessionAttribute(value = "memberId", required = false) Long memberId
    ) {
        if (memberId == null) {
            FreeLikeService.FreeLikeResult result = freeLikeService.isLikedByMember(memberId, freeBoardId);
            return LikeResponse.error(result.isLiked(), result.getLikeCount(), "로그인이 필요한 서비스입니다.");
        }
        FreeLikeService.FreeLikeResult result = freeLikeService.toggleLike(memberId, freeBoardId);

        log.debug("result: {}", result);

        return LikeResponse.success(result.isLiked(), result.getLikeCount(), "좋아요 처리되었습니다.");
    }
}













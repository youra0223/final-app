package com.example.finalapp.controller.board.free.comment;

import com.example.finalapp.dto.board.PageRequestDTO;
import com.example.finalapp.dto.board.SliceDTO;
import com.example.finalapp.dto.board.free.comment.FreeCommentListDTO;
import com.example.finalapp.dto.board.free.comment.FreeCommentModifyDTO;
import com.example.finalapp.dto.board.free.comment.FreeCommentWriteDTO;
import com.example.finalapp.service.board.free.comment.FreeCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FreeCommentApi {
    private final FreeCommentService freeCommentService;

    @PostMapping("/v1/free-boards/{freeBoardId}/comments")
    public void postFreeComment(@PathVariable("freeBoardId") Long freeBoardId,
                                @RequestBody FreeCommentWriteDTO commentWriteDTO,
                                @SessionAttribute("memberId") Long memberId) {
        freeCommentService.addFreeComment(commentWriteDTO, freeBoardId, memberId);
    }

    @GetMapping("/v1/free-boards/{freeBoardId}/comments")
    public Map<String, Object> getFreeComments(@PathVariable("freeBoardId") Long freeBoardId,
                                               PageRequestDTO pageRequestDTO) {
        int total = freeCommentService.getTotalByBoardId(freeBoardId);
//        List<FreeCommentListDTO> commentList = freeCommentService.getFreeComments(freeBoardId);
        SliceDTO<FreeCommentListDTO> sliceDTO = freeCommentService.getFreeCommentsByBoardIdWithSlice(freeBoardId, pageRequestDTO);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("total", total);
//        resultMap.put("commentList", commentList);
        resultMap.put("sliceDTO", sliceDTO);

        return resultMap;
    }

    @PatchMapping("/v1/free-comments/{freeCommentId}")
    public void patchFreeComment(@PathVariable("freeCommentId") Long freeCommentId,
                                 @RequestBody FreeCommentModifyDTO freeCommentModifyDTO) {

        freeCommentService.modifyFreeComment(freeCommentModifyDTO, freeCommentId);

    }

    @DeleteMapping("/v1/free-comments/{freeCommentId}")
    public void deleteFreeComment(@PathVariable("freeCommentId") Long freeCommentId) {
        freeCommentService.removeByCommentId(freeCommentId);
    }
}










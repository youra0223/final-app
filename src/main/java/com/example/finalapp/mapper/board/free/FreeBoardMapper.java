package com.example.finalapp.mapper.board.free;

import com.example.finalapp.dto.board.PageRequestDTO;
import com.example.finalapp.dto.board.free.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface FreeBoardMapper {
    void insertFreeBoard(FreeBoardWriteDTO boardWriteDTO);

    Optional<FreeBoardDetailDTO> selectById(Long freeBoardId);

    void updateViewCount(Long freeBoardId);

    List<FreeBoardListDTO> selectAllFreeBoards();

    void updateFreeBoard(FreeBoardModifyDTO freeBoardModifyDTO);

    void deleteFreeBoard(Long freeBoardId);

    List<FreeBoardListDTO> selectBySearchCondition(FreeBoardSearchDTO searchDTO);

    List<FreeBoardListDTO> selectBySearchCondWithPage(@Param("cond") FreeBoardSearchDTO searchDTO,
                                                      @Param("page") PageRequestDTO pageRequestDTO);

    int countBySearchCondition(FreeBoardSearchDTO searchDTO);
}














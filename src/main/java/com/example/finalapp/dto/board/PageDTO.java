package com.example.finalapp.dto.board;

import com.example.finalapp.dto.board.free.FreeBoardListDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString
public class PageDTO<T> {
    private int page;   // 현재 페이지 번호
    private int size;   // 한 페이지당 게시글 수
    private int total;  // 전체 게시글 수
    private int totalPages; // 전체 페이지 수
    private int startPage;  // 페이지 그룹의 시작 번호
    private int endPage;    // 페이지 그룹의 끝 번호
    private int pageGroup;  // 페이지 그룹당 페이지 수
    private List<T> list;

    public PageDTO(int page, int size, int total, List<T> list) {
        this(page, size, total, 5, list);
    }

    public PageDTO(int page, int size, int total, int pageGroup, List<T> list) {
        this.page = page;
        this.size = size;
        this.total = total;
        this.pageGroup = pageGroup;
        this.list = list;

        // 1. 전체 페이지 수 계산
        this.totalPages = total == 0 ? 1 : (int)Math.ceil( (double)total / size ) ;

        // 2. 현재 페이지 검증
        if (this.page > totalPages) {
            this.page = totalPages;
        }

        // 3. 페이지 그룹 시작 번호와 마지막 번호를 계산
        this.startPage = ((this.page - 1) / pageGroup) * pageGroup + 1;
        this.endPage = Math.min(startPage + (pageGroup - 1), totalPages);
    }

    // 4. 페이지 이동 가능 여부 확인
    public boolean hasPrevious() {
        return startPage > 1;
    }

    public boolean hasNext() {
        return page < totalPages;
    }

    // 5. 이전/다음 페이지 그룹 계산
    public boolean hasPreviousGroup() {
        return startPage > 1;
    }

    public boolean hasNextGroup() {
        return endPage < totalPages;
    }
}

package com.example.finalapp.dto.board.free;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter @Setter @ToString
public class FreeBoardListDTO {
    private Long freeBoardId;
    private String title;
    private int viewCount;
    private LocalDate regDate;
    private LocalDate modDate;
    private Long memberId;
    private String loginId;
    private int likeCount;
    private int commentCount;

    // 파일 관련
    private Long freeFileId;
    private String originalFilename;
    private String uuid;
    private String filePath;
    private String extension;
}















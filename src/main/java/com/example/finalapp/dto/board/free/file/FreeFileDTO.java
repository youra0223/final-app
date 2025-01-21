package com.example.finalapp.dto.board.free.file;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter @Setter @ToString
public class FreeFileDTO {
    private Long freeFileId;
    private String originalFilename;
    private String uuid;
    private String filePath;
    private String extension;
    private LocalDateTime regDate;
    private Long freeBoardId;
}









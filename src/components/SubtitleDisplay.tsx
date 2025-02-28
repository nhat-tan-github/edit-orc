import React from "react";

interface SubtitleDisplayProps {
    original: string;
    translated: string;
}

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({ original, translated }) => {
    return (
        <div style={{ position: "relative", width: "100%", padding: "20px" }}>
            {/* Văn bản gốc mờ, nằm trên */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: "white",
                    opacity: 0.5,
                    filter: "blur(2px)",
                    pointerEvents: "none",
                    fontSize: "1.5rem",
                    whiteSpace: "pre-wrap", // Hiển thị xuống dòng theo dữ liệu srt
                }}
            >
                {original}
            </div>
            {/* Văn bản dịch rõ */}
            <div
                style={{
                    position: "relative",
                    textAlign: "center",
                    color: "white",
                    fontSize: "1.8rem",
                    whiteSpace: "pre-wrap", // Hiển thị xuống dòng theo dữ liệu srt
                }}
            >
                {translated}
            </div>
        </div>
    );
};

export default SubtitleDisplay;
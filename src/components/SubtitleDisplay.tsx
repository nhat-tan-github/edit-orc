import React, { useState } from "react";

interface Subtitle {
  id: number;
  original: string;
  translated: string;
}

interface SubtitleDisplayProps {
  subtitles: Subtitle[]; // Array of subtitle objects
  maxSceneTime: number;  // Max duration of the scene (in seconds)
}

interface ContainerCheckboxState {
  lt1: boolean;
  lt2: boolean;
  lt3: boolean;
}

const formatTime = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}s`;
};

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  subtitles,
  maxSceneTime,
}) => {
  // Global state for header checkboxes
  const [allLt1State, setAllLt1State] = useState<boolean>(false);
  const [allLt2State, setAllLt2State] = useState<boolean>(false);
  const [allLt3State, setAllLt3State] = useState<boolean>(false);

  // Initialize container states from subtitles
  const [containerStates, setContainerStates] = useState<Record<number, ContainerCheckboxState>>(
    () =>
      subtitles.reduce((acc, cur) => {
        acc[cur.id] = { lt1: false, lt2: false, lt3: false };
        return acc;
      }, {} as Record<number, ContainerCheckboxState>)
  );

  // Dummy event handlers for other UI elements
  const undoAction = () => console.log("Undo action");
  const deleteLine = (id: number) => console.log("Delete line", id);
  const rerollLine = (id: number) => console.log("Reroll line", id);
  const changeDrawTimeline = (e: React.ChangeEvent<HTMLSelectElement>) =>
    console.log("Changed timeline segment:", e.target.value);

  // Header checkbox onChange handlers.
  // When clicked, update global state and update ALL container checkboxes of that type.
  const handleAllLt1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllLt1State(checked);
    setContainerStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[+key] = { ...updated[+key], lt1: checked };
      });
      return updated;
    });
  };

  const handleAllLt2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllLt2State(checked);
    setContainerStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[+key] = { ...updated[+key], lt2: checked };
      });
      return updated;
    });
  };

  const handleAllLt3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllLt3State(checked);
    setContainerStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[+key] = { ...updated[+key], lt3: checked };
      });
      return updated;
    });
  };

  // Container checkbox handlers.
  // When a container checkbox is clicked, update only that container's state.
  const handleContainerLt1Change = (id: number, checked: boolean) => {
    setContainerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], lt1: checked },
    }));
  };

  const handleContainerLt2Change = (id: number, checked: boolean) => {
    setContainerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], lt2: checked },
    }));
  };

  const handleContainerLt3Change = (id: number, checked: boolean) => {
    setContainerStates(prev => ({
      ...prev,
      [id]: { ...prev[id], lt3: checked },
    }));
  };

  // Shared style for right-side checkbox groups.
  // This style is used both in the control header and in each subtitle container.
  const rightGroupStyle: React.CSSProperties = {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,  // do not let it shrink
  };
  
  // In our case the checkboxes in the control header need extra right margin
  // to align with those in each container (which are inside a upline-line)
  const rightGroupStyleControl: React.CSSProperties = {
    ...rightGroupStyle,
    marginRight: "12px",  // adjust this value as needed for perfect alignment
  };

  // Other inline style objects
  const containerStyle: React.CSSProperties = {
    backgroundColor: "rgba(229, 236, 255, 0.1)",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const controlHeaderStyle: React.CSSProperties = {
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const leftControlStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 1,
    overflow: "hidden",  // hide overflow if the container shrinks
    whiteSpace: "nowrap",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: "8px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const mainTextStyle: React.CSSProperties = {
    cursor: "pointer",
    fontWeight: 500,
    opacity: 0.5,
    fontSize: "0.8rem",
  };

  const textAreaStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "vertical",
    backgroundColor: "transparent",
    color: "#fff",
  };

  // Reusable checkbox group component for header (global control)
  const CheckboxGroup = () => (
    <div style={rightGroupStyle}>
      <input
        type="checkbox"
        checked={allLt1State}
        onChange={handleAllLt1Change}
        className="long_tieng_all"
        style={{ cursor: "pointer" }}
      />
      <input
        type="checkbox"
        checked={allLt2State}
        onChange={handleAllLt2Change}
        className="long_tieng_all"
        style={{ cursor: "pointer" }}
      />
      <input
        type="checkbox"
        checked={allLt3State}
        onChange={handleAllLt3Change}
        className="long_tieng_all"
        style={{ cursor: "pointer" }}
      />
    </div>
  );

  return (
    <div id="string_edit" className="string-edit-layout" data-delogo="false">
      <div id="string_edit_div">
        {/* Control Header */}
        <div id="string_edit_control" style={controlHeaderStyle}>
          <div id="chunks_left" style={leftControlStyle}>
            <svg
              style={{ transform: "rotateZ(270deg)", color: "blueviolet", fontSize: "20px" }}
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              role="presentation"
              xmlns="http://www.w3.org/2000/svg"
              className="iconpark-icon"
            >
              <g>
                <path
                  data-follow-fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 2H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3ZM6 4h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                  fill="currentColor"
                />
                <path
                  data-follow-fill="currentColor"
                  d="M14.914 15.57L12 18.482 9.086 15.57 7.67 16.983l3.268 3.268a1.5 1.5 0 0 0 2.121 0l3.268-3.268-1.414-1.414Z"
                  fill="currentColor"
                />
              </g>
            </svg>
            <select
              title="Chia bản dịch thành nhiều đoạn nhỏ giảm thiểu hiện tượng giật lag trong khi chỉnh sửa!"
              onChange={changeDrawTimeline}
              id="chunk"
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                color: "#fff",
                backgroundColor: "transparent",
              }}
            >
              <option value={`0-${maxSceneTime}`}>
                Toàn bộ: 0:00s - {formatTime(maxSceneTime)}
              </option>
            </select>
            <div
              id="pre_button"
              className="undo"
              onClick={undoAction}
              style={{ color: "rgba(222, 227, 247, 0.2)", cursor: "pointer" }}
            >
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8.94 3.146a.5.5 0 0 1 .707 0l.707.708a.5.5 0 0 1 0 .707L7.914 7H13.5a6.5 6.5 0 0 1 0 13H6.224l.535-2H13.5a4.5 4.5 0 0 0 0-9H7.914l2.44 2.44a.5.5 0 0 1 0 .706l-.707.708a.5.5 0 0 1-.708 0l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div
              className="undo"
              id="next_button"
              style={{ cursor: "pointer" }}
            >
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.354 3.146a.5.5 0 0 0-.707 0l-.707.708a.5.5 0 0 0 0 .707L16.379 7h-5.586a6.5 6.5 0 0 0 0 13h7.277l-.536-2h-6.741a4.5 4.5 0 0 1 0-9h5.586l-2.44 2.44a.5.5 0 0 0 0 .706l.708.708a.5.5 0 0 0 .707 0l4.5-4.5a.5.5 0 0 0 0-.708l-4.5-4.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div
              id="save_json"
              className="undo"
              onClick={() => console.log("Save JSON")}
              style={{ cursor: "pointer" }}
            >
              <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10.451 8.118a.5.5 0 0 1 0 .707l-2.646 2.646a.667.667 0 0 1-.943 0L5.215 9.825a.5.5 0 0 1 0-.707l.236-.236a.5.5 0 0 1 .707 0l1.175 1.175 2.175-2.175a.5.5 0 0 1 .708 0l.235.236Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 2a4.667 4.667 0 0 0-4.611 5.39A3.334 3.334 0 0 0 4 14h8a3.333 3.333 0 0 0 .611-6.61A4.667 4.667 0 0 0 8 2ZM3.632 8.7l1.273-.236-.199-1.28a3.333 3.333 0 1 1 6.587 0l-.198 1.28 1.273.236A2.001 2.001 0 0 1 12 12.667H4A2 2 0 0 1 3.632 8.7Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div
              id="project_name"
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
              <span>|</span>
              <span id="project_name_span"></span>
            </div>
          </div>
          {/* Right-side checkboxes in control header */}
          <div id="chunks_right" style={rightGroupStyleControl}>
            <CheckboxGroup />
          </div>
        </div>

        {/* Render multiple subtitle containers */}
        {subtitles.map((subtitle) => (
          <div
            key={subtitle.id}
            id={`container_${subtitle.id}`}
            className="string_container"
            name={`text_${subtitle.id}`}
            style={containerStyle}
          >
            <div className="upline line" style={headerStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  id={`upline_${subtitle.id}`}
                  name={`text_${subtitle.id}`}
                  onDoubleClick={() => console.log("Edit main string", subtitle.id)}
                  className="l1 src-string line2"
                  style={mainTextStyle}
                >
                  {subtitle.original}
                </div>
                <div
                  id={`delete_${subtitle.id}`}
                  onClick={() => deleteLine(subtitle.id)}
                  className="delete_line"
                  name={`text_${subtitle.id}`}
                  style={{ cursor: "pointer" }}
                >
                  <i id={`icon_${subtitle.id}`} className="fa-solid fa-trash-can" />
                </div>
                <div
                  id={`reroll_${subtitle.id}`}
                  onClick={() => rerollLine(subtitle.id)}
                  name={`text_${subtitle.id}`}
                  className="rerool_sound"
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-solid fa-rotate-right" />
                </div>
              </div>
              {/* Right-side checkbox group in container header using container state */}
              <div style={rightGroupStyle}>
                <input
                  type="checkbox"
                  checked={containerStates[subtitle.id]?.lt1 || false}
                  onChange={e =>
                    handleContainerLt1Change(subtitle.id, e.target.checked)
                  }
                  className="long_tieng"
                  style={{ cursor: "pointer" }}
                />
                <input
                  type="checkbox"
                  checked={containerStates[subtitle.id]?.lt2 || false}
                  onChange={e =>
                    handleContainerLt2Change(subtitle.id, e.target.checked)
                  }
                  className="long_tieng_2"
                  style={{ cursor: "pointer" }}
                />
                <input
                  type="checkbox"
                  checked={containerStates[subtitle.id]?.lt3 || false}
                  onChange={e =>
                    handleContainerLt3Change(subtitle.id, e.target.checked)
                  }
                  className="long_tieng_3"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="downline line notranslate" style={{ paddingTop: "4px" }}>
              <div className="line2">
                <textarea
                  id={`textbox_${subtitle.id}`}
                  name={`text_${subtitle.id}`}
                  onInput={() => {}}
                  className="json active_right"
                  onClick={() => {}}
                  onChange={() => {}}
                  style={textAreaStyle}
                >
                  {subtitle.translated}
                </textarea>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtitleDisplay;
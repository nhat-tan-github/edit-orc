import Timeline from "./timeline";
import useStore from "./store/use-store";
import Navbar from "./navbar";
import MenuList from "./menu-list";
import { MenuItem } from "./menu-item";
import useTimelineEvents from "@/hooks/use-timeline-events";
import Scene from "./scene";
import StateManager, { DESIGN_LOAD } from "@designcombo/state";
import { ControlItem } from "./control-item";
import ControlList from "./control-list";
import { useEffect, useRef } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { dispatch } from "@designcombo/events";
import { data } from "./data";
import SubtitleDisplay from "@/components/SubtitleDisplay";

const stateManager = new StateManager({
    size: {
        width: 1920,
        height: 1080,
    },
    scale: {
        // 1x distance (second 0 to second 5, 5 segments).
        index: 7,
        unit: 300,
        zoom: 1 / 300,
        segments: 5,
    },
});
// Dữ liệu phụ đề
const subtitles = [
    { id: 0, original: "Nội dung gốc 0", translated: "Nội dung dịch 0" },
    { id: 1, original: "Nội dung gốc 1", translated: "Nội dung dịch 1" },
    { id: 2, original: "Nội dung gốc 2", translated: "Nội dung dịch 2" },
    { id: 3, original: "Nội dung gốc 3", translated: "Nội dung dịch 3" },

  ];
  
const App = () => {
    const timelinePanelRef = useRef<ImperativePanelHandle>(null);
    const { timeline, playerRef } = useStore();

    useTimelineEvents();

    useEffect(() => {
        if (!timeline) return;
        dispatch(DESIGN_LOAD, {
            payload: data,
        });
    }, [timeline]);

    useEffect(() => {
        const screenHeight = window.innerHeight;
        const desiredHeight = 300;
        const percentage = (desiredHeight / screenHeight) * 100;
        timelinePanelRef.current?.resize(percentage);
    }, []);

    const handleTimelineResize = () => {
        const timelineContainer = document.getElementById("timeline-container");
        if (!timelineContainer) return;
        timeline?.resize(
            {
                height: timelineContainer.clientHeight - 90,
                width: timelineContainer.clientWidth - 40,
            },
            {
                force: true,
            }
        );
    };

    useEffect(() => {
        const onResize = () => handleTimelineResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [timeline]);

    return (
        <ResizablePanelGroup direction="horizontal" style={{ height: "100vh" }}>
            {/* Left panel: chứa Navbar, MenuList, MenuItem, ControlList, ControlItem */}
            <ResizablePanel defaultSize={3} className="overflow-auto">
                <MenuList />
                <MenuItem />
                <ControlList />
                <ControlItem />
            </ResizablePanel>
            <ResizableHandle />
            {/* Panel giữa: hiển thị phụ đề sử dụng SubtitleDisplay */}
            <ResizablePanel defaultSize={20} className="overflow-auto">
                <SubtitleDisplay
                    subtitles={subtitles}              
                />
            </ResizablePanel>
            <ResizableHandle />
            {/* Panel bên phải: Scene chính và timeline bên dưới */}
            <ResizablePanel defaultSize={50} className="overflow-auto">
                <ResizablePanelGroup direction="vertical" style={{ height: "100%" }}>
                    <ResizablePanel defaultSize={70} className="relative">
                    <Navbar />
                    <Scene stateManager={stateManager} />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel
                        defaultSize={30}
                        ref={timelinePanelRef}
                        className="min-h-[50px]"
                        onResize={handleTimelineResize}
                    >
                        {playerRef && <Timeline stateManager={stateManager} />}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default App;
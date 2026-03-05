import styled from "styled-components";
import * as token from "@/styles/values/token";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: zoom-out;
`;

export const Toolbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  ${token.flexRow};
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  gap: 8px;
  z-index: 2001;
`;

export const ToolbarButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  ${token.flexCenter};
  cursor: pointer;
  color: ${token.colors.text.white};
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const ImageWrapper = styled.div<{ $scale: number; $x: number; $y: number; $canPan: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 85vh;
  cursor: ${({ $canPan }) => ($canPan ? "grab" : "default")};
  transition: ${({ $canPan }) => ($canPan ? "none" : "transform 0.2s ease")};
  transform: scale(${({ $scale }) => $scale}) translate(${({ $x, $scale }) => $x / $scale}px, ${({ $y, $scale }) => $y / $scale}px);

  &:active {
    cursor: ${({ $canPan }) => ($canPan ? "grabbing" : "default")};
  }
`;

export const PreviewImage = styled.img`
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
  user-select: none;
  -webkit-user-drag: none;
`;

export const ZoomControls = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  ${token.flexRow};
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 28px;
  padding: 8px 16px;
  z-index: 2001;
`;

export const ZoomLabel = styled.span`
  ${token.typography("body", "sm", "medium")};
  color: ${token.colors.text.white};
  min-width: 40px;
  text-align: center;
  user-select: none;
`;

export const NavButton = styled.button<{ $direction: "left" | "right" }>`
  position: fixed;
  top: 50%;
  ${({ $direction }) => ($direction === "left" ? "left: 16px;" : "right: 16px;")}
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  ${token.flexCenter};
  cursor: pointer;
  color: ${token.colors.text.white};
  z-index: 2001;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const PageIndicator = styled.span`
  ${token.typography("body", "sm", "medium")};
  color: ${token.colors.text.white};
  margin-left: 8px;
  user-select: none;
  opacity: 0.7;
`;

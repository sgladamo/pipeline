import { SvgIconProps, SvgIcon } from "@mui/material";

export function CapacityIcon(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" viewBox="0 0 24 24" {...props}>
      <path d="M2,2H4V20H22V22H2V2M7,10H17V13H7V10M11,15H21V18H11V15M6,4H22V8H20V6H8V8H6V4Z" />
    </SvgIcon>
  );
}

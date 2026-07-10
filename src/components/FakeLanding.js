import { Box, Skeleton } from '@mui/material';

const tint = { bgcolor: "rgba(57,255,20,0.06)" };

function FakeLanding() {

  return (
    <Box sx = {{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        pt: "68.5px"
    }}>
        <Box sx = {{
            pb: 1,
            pt: {md: 6, sm: 4, xs: 4},
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1
        }}>
            <Skeleton
                variant="rounded"
                sx = {{
                    ...tint,
                    width: {md: 860, sm: 560, xs: 320},
                    height: {md: 80, sm: 60, xs: 56}
                }}
            />
            <Skeleton
                variant="rounded"
                sx = {{
                    ...tint,
                    display: {sm: "none", xs: "inline-flex"},
                    width: 150,
                    height: 56
                }}
            />
        </Box>

        <Skeleton
            variant="rounded"
            sx = {{
                ...tint,
                width:{md: 700, sm: 500, xs: 300},
                height: 56
            }}
        />
        <Skeleton
            variant="rounded"
            sx = {{ ...tint, width: 183, height: 36.5 }}
        />
    </Box>
  );
}

export default FakeLanding;

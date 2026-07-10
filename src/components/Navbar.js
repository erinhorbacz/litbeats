import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";

const pages = ['Home', 'About'];

function Navbar({ titleGradient }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const brand = (
    <Typography
      component={Link}
      to="/"
      sx={{
        fontWeight: 800,
        fontSize: '1.25rem',
        letterSpacing: '-0.02em',
        textDecoration: 'none',
        background: titleGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      LitBeats
    </Typography>
  );

  const barSx = {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    px: { xs: 2, sm: 4 },
    py: 1.5,
    backdropFilter: 'blur(12px)',
    backgroundColor: 'rgba(10,11,10,0.72)',
    borderBottom: '1px solid rgba(57,255,20,0.16)',
  };

  return (
    <Box>
      {/* Desktop */}
      <Box sx={{
        ...barSx,
        display: { sm: 'flex', xs: 'none' },
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {brand}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {pages.map((page) => (
            <Button
              variant="text"
              component={Link}
              to={page === 'Home' ? '/' : `/${page}`}
              key={page}
              className="title-3d-sm"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                px: 2,
                '&:hover': { color: 'primary.main', backgroundColor: 'transparent' },
              }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Mobile */}
      <Box sx={{
        ...barSx,
        display: { sm: 'none', xs: 'flex' },
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {brand}
        <IconButton
          onClick={(event) => { setAnchorEl(event.currentTarget) }}
          sx={{ color: 'primary.main' }}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => { setAnchorEl(null) }}
          sx={{ ".MuiMenu-list": { py: 0.5 } }}
        >
          {pages.map((page) => (
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={page === 'Home' ? '/' : `/${page}`}
              key={page}
            >
              <MenuItem
                onClick={() => setAnchorEl(null)}
                className="title-3d-sm"
                sx={{ '&:hover': { color: 'primary.main', backgroundColor: 'transparent' } }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {page}
                </Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}

export default Navbar;

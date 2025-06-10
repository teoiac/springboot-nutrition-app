import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem, Image,
} from '@nextui-org/react';
import {Plus, Edit3, LogOut, BookDashed, Tag, ListTree, MessageSquareText} from 'lucide-react';
import logo from '../../public/logo-blog.png'

interface NavBarProps {
  isAuthenticated: boolean;
  isAdmin?:boolean;
  userProfile?: {
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
                                         isAuthenticated,
                                         userProfile,
                                         isAdmin,
                                         onLogout,
                                       }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { name: 'Acasă', path: '/' },
    { name: 'Despre mine', path: '/despre-mine' },
    { name: 'Servicii', path: '/servicii' },
    { name: 'Programări', path: '/programari' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
      <Navbar
          isBordered
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          className="mb-6 bg-[#78a461]"

      >
        {/* Mobile menu toggle */}
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Brand - left side */}
        <NavbarContent className="hidden sm:flex" justify="start">
          <NavbarBrand>
            <Link to="/">
              <Image src={logo} className="w-20 h-auto" ></Image>

            </Link>
          </NavbarBrand>
        </NavbarContent>


        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
              <NavbarItem
                  key={item.path}
                  isActive={location.pathname === item.path}
              >
                <Link
                    to={item.path}
                    className={`text-sm font-medium ${
                        location.pathname === item.path
                            ? 'text-white'
                            : 'text-default-800'
                    }`}
                >
                  {item.name}
                </Link>
              </NavbarItem>
          ))}
        </NavbarContent>

        {/* Auth buttons - right side */}
        <NavbarContent justify="end">
          {isAuthenticated ? (
              <>
                {/* Show these buttons only for admin */}
                {isAdmin && (
                    <>
                      <NavbarItem>
                        <Button
                            as={Link}
                            to="/posts/drafts"
                            color="secondary"
                            variant="flat"
                            startContent={<BookDashed size={16} />}
                        >
                          Postări Draft
                        </Button>
                      </NavbarItem>
                      <NavbarItem>
                        <Button
                            as={Link}
                            to="/posts/new"
                            color="primary"
                            variant="flat"
                            startContent={<Plus size={16} />}
                        >
                          Postare Noua
                        </Button>
                      </NavbarItem>
                    </>
                )}

                <NavbarItem>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Avatar
                          isBordered
                          as="button"
                          className="transition-transform"
                          src={userProfile?.avatar}
                          name={userProfile?.name}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User menu">
                      {isAdmin ? (
                          <>
                            <DropdownItem
                                key="drafts"
                                startContent={<Edit3 size={16} />}
                            >
                              <Link to="/posts/drafts">Schitele mele</Link>
                            </DropdownItem>
                            <DropdownItem
                                key="tags"
                                startContent={<Tag size={16} />}
                            >
                              <Link to="/tags">Manager Tag-uri</Link>
                            </DropdownItem>
                            <DropdownItem
                                key="categories"
                                startContent={<ListTree size={16} />}
                            >
                              <Link to="/categories">Manager Categorii</Link>
                            </DropdownItem>
                            <DropdownItem
                              key="contact-messages"
                              startContent={<MessageSquareText size={19}/>}
                              >
                              <Link to="/contact-messages">Mesaje de Contact</Link>
                            </DropdownItem>
                          </>
                      ) : null}

                      <DropdownItem
                          key="logout"
                          startContent={<LogOut size={16} />}
                          className="text-danger"
                          color="danger"
                          onPress={onLogout}
                      >
                        Deconectare
                      </DropdownItem>

                    </DropdownMenu>
                  </Dropdown>
                </NavbarItem>
              </>
          ) : (
              <>
                <NavbarItem>
                  <Button as={Link} to="/login" variant="flat">
                    Autentificare
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button as={Link} to="/register" variant="flat">
                    Înregistrare
                  </Button>
                </NavbarItem>
              </>
          )}
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu>
          {menuItems.map((item) => (
              <NavbarMenuItem key={item.path}>
                <Link
                    to={item.path}
                    className={`w-full ${
                        location.pathname === item.path
                            ? 'text-primary'
                            : 'text-default-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
  );
};

export default NavBar;
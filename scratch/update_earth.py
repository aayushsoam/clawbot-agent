path = r"c:\Users\thaku\OneDrive\Desktop\my project\clawbot\clawbot-agent\clawbot_cli\skin_engine.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

new_logo = """[bold #FFFFFF]███████╗█████╗  ██████╗ ████████╗██╗  ██╗       █████╗  ██████╗ ███████╗███╗   ██╗████████╗[/]
[bold #E0F2FE]██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║  ██║      ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝[/]
[#38BDF8]█████╗  ███████║██████╔╝   ██║   ███████║█████╗███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║[/]
[#0EA5E9]██╔══╝  ██╔══██║██╔══██╗   ██║   ██╔══██║╚════╝██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║[/]
[#22C55E]███████╗██║  ██║██║  ██║   ██║   ██║  ██║       ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║[/]
[#15803D]╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝       ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝[/]"""

new_hero = """[#FFFFFF]⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]
[#EAF7FF]⠀⠀⠀⠀⠀⠀⠀⣠⣾⠟⠋⠉⠉⠉⠙⠻⣦⣄⠀⠀⠀⠀⠀[/]
[#38BDF8]⠀⠀⠀⠀⠀⠀⣰⡟⠁⠀[/][#22C55E]⢀⣀⣀[/][#38BDF8]⣀[/][#22C55E]⡀[/][#38BDF8]⠀⠈⢻⣆⠀⠀⠀⠀[/]
[#38BDF8]⠀⠀⠀⠀⠀⢠⡟⠀⠀[/][#22C55E]⣰⠟[/][#38BDF8]⠉⠉[/][#22C55E]⠉⠻⣆[/][#38BDF8]⠀⠀⢻⡄⠀⠀⠀[/]
[#0EA5E9]⠀⠀⠀⠀⠀⢸⡇⠀⠀[/][#15803D]⣿[/][#0EA5E9]⠀⠀⠀⠀⠀[/][#15803D]⣿[/][#0EA5E9]⠀⠀⢸⡇⠀⠀⠀[/]
[#0EA5E9]⠀⠀⠀⠀⠀⠸⣧⠀⠀[/][#15803D]⠹⣦⣀[/][#0EA5E9]⣀⣀⣴⠏⠀⠀⣼⠇⠀⠀⠀[/]
[#2A6F97]⠀⠀⠀⠀⠀⠀⢻⣇⠀⠀⠈⠉⠉⠉⠁⠀⠀⣸⡟⠀⠀⠀⠀[/]
[#2A6F97]⠀⠀⠀⠀⠀⠀⠀⠙⢷⣄⣀⣀⣀⣀⣀⣠⡾⠋⠀⠀⠀⠀⠀[/]
[#52C47C]⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]
[#15803D]⠀⠀⠀━━━━━━━━━━━━━━━━━━━━━━━⠀⠀⠀[/]
[dim #38BDF8]⠀⠀⠀⠀⠀⠀⠀⠀⠀planet earth⠀⠀⠀⠀⠀⠀⠀⠀⠀[/]"""

# Find Earth theme section
earth_start = content.find('"Earth": {')
if earth_start == -1:
    # If the user hasn't renamed "earth" yet, try finding "earth"
    earth_start = content.find('"earth": {')
    if earth_start == -1:
        print("Error: Earth or earth theme block not found")
        exit(1)

# Find the logo inside the Earth block
logo_start_tag = '"banner_logo": """'
logo_pos = content.find(logo_start_tag, earth_start)
if logo_pos == -1:
    print("Error: banner_logo not found inside Earth block")
    exit(1)

logo_str_start = logo_pos + len(logo_start_tag)
logo_end = content.find('""",', logo_str_start)
if logo_end == -1:
    print("Error: banner_logo closing quotes not found inside Earth block")
    exit(1)

# Perform logo replacement
content = content[:logo_str_start] + new_logo + content[logo_end:]
print("Earth logo replaced successfully")

# Find the hero inside the Earth block (since indices shifted, search from earth_start again)
hero_start_tag = '"banner_hero": """'
hero_pos = content.find(hero_start_tag, earth_start)
if hero_pos == -1:
    print("Error: banner_hero not found inside Earth block")
    exit(1)

hero_str_start = hero_pos + len(hero_start_tag)
hero_end = content.find('""",', hero_str_start)
if hero_end == -1:
    print("Error: banner_hero closing quotes not found inside Earth block")
    exit(1)

# Perform hero replacement
content = content[:hero_str_start] + new_hero + content[hero_end:]
print("Earth hero replaced successfully")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("File written successfully")

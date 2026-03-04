import re

replacements = [
    ("typography('text', 'xlarge', 'bold')", "typography('heading', 'md', 'bold')"),
    ("typography('text', 'large', 'semibold')", "typography('body', 'lg', 'semibold')"),
    ("typography('text', 'large', 'bold')", "typography('body', 'lg', 'bold')"),
    ("typography('text', 'medium', 'regular')", "typography('body', 'md', 'regular')"),
    ("typography('text', 'medium', 'bold')", "typography('body', 'md', 'bold')"),
    ("typography('text', 'small', 'semibold')", "typography('body', 'sm', 'semibold')"),
    ("typography('text', 'small', 'regular')", "typography('body', 'sm', 'regular')"),
    ("typography('text', 'xsmall', 'semibold')", "typography('caption', 'lg', 'semibold')"),
    ("typography('text', 'xsmall', 'regular')", "typography('caption', 'lg', 'regular')"),
    ('colors.text.primary', 'colors.text.strong'),
    ('colors.text.secondary', 'colors.text.neutral'),
    ('colors.text.tertiary', 'colors.text.coolGray'),
    ('colors.line.primary', 'colors.line.normal'),
    ('colors.line.secondary', 'colors.line.neutral'),
    ('colors.background.primary', 'colors.background.white'),
    ('colors.background.secondary', 'colors.background.f5'),
    ('colors.fill.primary', 'colors.fill.normal'),
    ('colors.fill.secondary', 'colors.fill.neutral'),
]

elevation_pattern = r"box-shadow: \$\{token\.elevation\.black_(\d)\}"
elevation_repl = r"${token.elevation('black_\1')}"

main_pattern = r'colors\.main(?!\.)'
main_repl = 'colors.main.yellow'

files = [
    'src/pages/Project/ProjectDetail/Diagram/ProjectDiagram.styled.ts',
    'src/pages/Project/ProjectDetail/Schema/ProjectSchema.styled.ts',
]

for fpath in files:
    with open(fpath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    content = re.sub(elevation_pattern, elevation_repl, content)
    content = re.sub(main_pattern, main_repl, content)
    
    with open(fpath, 'w') as f:
        f.write(content)
    
    print('Fixed: ' + fpath)

print('Done!')

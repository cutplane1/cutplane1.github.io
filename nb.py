# https://github.com/cutplane1/tinythings/tree/master/nanoblog
tmpl = '<div class="post">\n<time>{}</time>\n<p>{}</p>\n</div>\n'
url = "https://cutplane1.github.io"

def add_post(pattern: tuple, text: str, file_name: str, date: str):
    with open(file_name, "r", encoding="utf-8") as f:
        contents = f.read()
    
    with open(file_name, "w", encoding="utf-8") as f:
        m_contents = contents.replace(pattern[0]+pattern[1], pattern[0]+tmpl.format(date, text)+pattern[1],1)
        f.write(m_contents)

def git_repo_push_script():
    import os
    print(f"-uploading...-")
    os.system('git add .')
    os.system('git commit -m "upd"')
    os.system('git push')
    print(f"-upload completed-")


def parse_args(args: list[str]):
    e = []
    for arg in args:
        if arg.startswith("http") or arg.startswith("@"):
            if arg.startswith("@"):
                arg = url + "/" + arg[1:]
            if arg.endswith(('.apng', '.png', '.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp')):
                e.insert(0, f'<img src="{arg}"><br>')
            else:
                e.append(f'<a href="{arg}">{arg}</a>')
        elif arg == "~n":
            e.append("<br>")
        else:
            e.append(arg)
    return " ".join(e)


if __name__ == "__main__":
    import sys
    import datetime
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
    print(f"-writing to file...-")
    add_post(('</a>\n', '<div class="post">\n'), parse_args(sys.argv[1:]), "index.html", now)
    git_repo_push_script()

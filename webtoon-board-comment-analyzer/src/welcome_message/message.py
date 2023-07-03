from pyfiglet import Figlet


def show_welcome_message():
    f = Figlet(font='slant')
    print(f.renderText('rhya_network'))

    print("Welcome to RHYA.Network webtoon board comment analyzer!")
    print("This tool is dedicated to Webtoon board project webtoon comment analysis.")
    print()
    print("Copyright (c) 2023 RHYA.Network. All rights reserved.")
    print()
    print("It is recommended that only administrators use this tool because incorrect")
    print("use of it can cause fatal problems with the service.")
    print("If you are not an administrator, please exit the program immediately.")
    print()

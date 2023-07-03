import requests


def download_webtoon_board_repo(zip_file, token):
    headers = {
        'Accept': 'application/vnd.github+json',
        'Authorization': f'Bearer {token}',
        'X-GitHub-Api-Version': '2022-11-28'
    }

    with open(zip_file, "wb") as file:
        response = requests.get("https://api.github.com/repos/fkdldkRhya/RHYANetwork_WebtoonBoard/zipball/master",
                                headers=headers)
        file.write(response.content)

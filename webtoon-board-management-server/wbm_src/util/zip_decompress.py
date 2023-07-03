import zipfile


def unzipping(zip_file, unzip_path):
    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
        zip_ref.extractall(unzip_path)

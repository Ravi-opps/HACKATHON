from dotenv import load_dotenv

load_dotenv()
import os
print(os.getenv("SARVAM_API_KEY"))

# import os
print("CWD:", os.getcwd())

# import os
print(".env exists:", os.path.exists(".env"))


# import os


print("ENV VALUE:", os.getenv("SARVAM_API_KEY"))
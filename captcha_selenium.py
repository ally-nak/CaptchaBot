from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
print("start python")
browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
print("got browser")
browser.get("https://worldwide.espacenet.com/publicationDetails/originalDocument?CC=JP&NR=2009123123A&KC=A&FT=D&ND=3")
print("opened web page")



browser.quit()
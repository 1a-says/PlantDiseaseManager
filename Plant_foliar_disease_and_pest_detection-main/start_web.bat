@echo off
cd /d "%~dp0"
call venv\Scripts\activate
python -m streamlit run src/datas/orange_classifier_web.py
pause

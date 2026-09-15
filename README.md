# Django + PostgreSQL + Three.js 3D Viewer

Django와 PostgreSQL을 연동하여 3D 모델 데이터를 저장하고, Three.js를 이용해 브라우저에서 직육면체를 시각화하는 프로젝트입니다.

배포 환경에서는 NGINX와 Gunicorn을 사용하여 Django 애플리케이션을 서비스하도록 구성했습니다.

---

## 주요 기능

- PostgreSQL에 3D 모델 정보 저장
- 저장된 모델 목록 조회
- 선택한 모델을 Three.js로 렌더링
- 모델 삭제
- 마우스 Drag로 모델 이동
- Ctrl + Drag로 모델 회전
- 마우스 Wheel로 Zoom In / Out
- Django Admin을 통한 데이터 관리
- NGINX + Gunicorn 기반 배포

---

## 사용 기술

- Python
- Django
- PostgreSQL
- Three.js
- JavaScript
- HTML / CSS
- Gunicorn
- NGINX
- AWS EC2 Ubuntu

---

## 프로젝트 구조
<img width="1672" height="941" alt="Image" src="https://github.com/user-attachments/assets/48dc6f73-b68e-4faa-a801-39b4a358528d" />

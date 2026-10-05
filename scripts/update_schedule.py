import json
import os
import sys

def main():
    post = {
        "filename": "2026-adsense-high-cpc-keyword-seo-blog.html",
        "title": "2026년 구글 애드센스 수익 극대화 고단가 키워드 블로그 세팅 총정리",
        "description": "2026년 구글 애드센스 수익을 극대화할 수 있는 고단가(High CPC) 키워드 발굴 방법과 SEO 블로그 세팅 완벽 가이드를 제공합니다. 초보자도 쉽게 따라할 수 있는 수익화 노하우를 확인하세요.",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        "tag": "애드센스 수익화",
        "date_display": "2026. 10. 05 (오전 10:45)",
        "publish_date": "2026-10-05",
        "publish_time": "10:45"
    }

    schedule_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'schedule.json')
    
    with open(schedule_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check if exists
    if not any(p['filename'] == post['filename'] for p in data['posts']):
        data['posts'].insert(0, post) # add to top
        with open(schedule_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Successfully updated schedule.json")
    else:
        print("Post already exists in schedule.json")

if __name__ == "__main__":
    main()

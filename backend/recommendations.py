def get_ai_recommendations(student_profile: dict, alumni_profiles: list[dict]) -> list[dict]:
    """
    Intelligent mentor recommendation based on skill overlap and experience.
    """

    student_skills = set(student_profile.get("skills", []))
    student_goals = student_profile.get("career_goals", "").lower()

    scored_alumni = []

    for alumni in alumni_profiles:
        alumni_skills = set(alumni.get("skills", []))
        experience = alumni.get("years_of_experience", 0)

    
        skill_match_score = len(student_skills.intersection(alumni_skills))

        
        goal_bonus = 1 if student_goals and student_goals in str(alumni.get("designation", "")).lower() else 0

        total_score = skill_match_score + goal_bonus + (experience * 0.1)

        scored_alumni.append({
            "profile": alumni,
            "score": total_score
        })

    
    scored_alumni.sort(key=lambda x: x["score"], reverse=True)


    return [item["profile"] for item in scored_alumni[:5]]

# Generated by Django 4.2.7 on 2024-05-04 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0013_question_question_sound_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="usertestsubmission",
            name="total_score",
            field=models.FloatField(default=0),
        ),
    ]

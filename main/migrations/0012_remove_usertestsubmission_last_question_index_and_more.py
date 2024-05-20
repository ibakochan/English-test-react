# Generated by Django 4.2.7 on 2024-04-19 10:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0011_usertestsubmission_last_question_index"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="usertestsubmission",
            name="last_question_index",
        ),
        migrations.AddField(
            model_name="usertestsubmission",
            name="last_answered_question",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="main.question",
            ),
        ),
    ]

# Generated by Django 4.2.7 on 2024-05-17 00:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0033_remove_test_classroom_test_classroom"),
    ]

    operations = [
        migrations.AddField(
            model_name="test",
            name="total_questions",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
